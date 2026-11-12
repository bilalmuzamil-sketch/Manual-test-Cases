# Internal Work Orders — report, rounds 1, 2a, 2b, 2c and 3 (PRD v1.1, Jira, tech plan, design; Milos Vasic's answers), 12 Nov 2026

## Round 3 (12 Nov 2026): PRD v1.1 and Milos Vasic's answers 1-16

- Every case now quotes **PRD v1.1** (From line "version 1.1 (12 Nov 2026, Milos Vasic)"); v1.1 changed 15 requirements and message rows, added S2-E8 and the message row "Reopen done" (rows 25-42 became 26-43). Milos's answers are quoted only where v1.1 does not carry them: question 10 (API-23).
- Per case, part by part: `po-answers-2026-11-12/PASS-REPORT.md`. Updates to send: 636; new cases: S4-15, S9-47, S9-48, S1-92, S1-93, S1-94; deleted on the QA lead's go-ahead: D-87, D-89, D-91; proposed for deletion: S2-90, S8-26; released into run 559: S1-02b, S2-28, S2-32b, DATA-09, D-88, D-90, D-92, S2-100, S2-106, S6-10, S7-38, S12P-11, S4-15, S9-47, S9-48, S1-92, S1-93, S1-94.
- Held cases: none waits on the PO any more. API-23 is released from question 10 but stays blocked on the Open API release (the Open API owner's confirmation is still pending, Milos: "test against (a)").
- Register: IWO-D09, D19, D29, D44, D45 settled by PRD v1.1, D31 closed (the design matches), IWO-D56 added (design worker's assessment); 0 design questions open. Skill 07 §6.0 applied: **no new question**.
- Write scripts (dry run by default): `po-answers-2026-11-12/write/` — update (locked on the live text), create the new cases, delete the 3, sync run 559 (union only).

Worker: PRD cases (round 1), the tech plan fold-in (round 2a) and the design fold-in (round 2b), each on the coordinator's order. No writes to TestRail, Jira, Slack or Google; no commits.

## Counts

- **664 cases** in the library; **642 for TestRail** (section 136701); **22 kept out** (a tester cannot set them up: NO-MANUAL-PROPOSAL.md).
- Round 2a added 71 cases (S1-83, S1-84, S1-85, S1-86, S1-87, S1-88, S1-89, S1-90, S1-91, S2-98, S2-99, S2-100, S2-101, S2-102, S2-103, S2-104, S2-106, S3-55, S3-56, S6-09, S6-10, S7-36, S7-37, S7-38, S8-28, S8-29, S8-30, S8-31, S9-45, S9-46, S10-15, S12-44, S12-45, S12-46, S12-47, S12-48, S12P-11, S12P-12, S12P-13, API-25, API-26, API-27, INV-15, INV-16, INV-17, INV-18, INV-19, INV-20, INV-21, INV-22, INV-23, INV-24, INV-25, INV-26, INV-27, INV-28, INV-29, INV-30, INV-31, INV-32, INV-33, INV-34, INV-35, REL-06, REL-07, S4-15, S9-47, S9-48, S1-92, S1-93, S1-94) and changed 46 existing cases (listed below, Rule 134).
- By story section: S1 97, S2 106, S3 56, S4 15, S5 14, S6 10, S7 38, S8 31, S9 48, S10 15, S12 48, S13 6, S12P 13, API 27, DATA 9, REL 7, INV 35, DESIGN 89.
- By TestRail folder (build.py FOLDER): Turn on Internal Work Orders, internal customers and categories 97, Internal and no-charge work orders from creation to Close 105, Blocked on the Maintenance Reminders release 1, Close an internal or no-charge work order 56, Reopen a closed internal or no-charge work order 15, QuickBooks Online account mapping 14, AccountingHub account mapping 10, QuickBooks Online journal entries 38, AccountingHub records and entries 31, Reports, dashboard and exports 48, Shop supplies on internal and no-charge work orders 15, No-charge line on a billable work order 48, Starting categories and accounts 6, No-charge estimates and lines in the customer portal 13, API 7, Blocked on the Open API release 19, Numbers across the documents, reports and books 9, Run on Production After Release 8, What must not change 35, Design — how it looks 89.
- Held: 50 — 5 × `a tester cannot set this up through the screens: the save has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: some conversions have to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: the save finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: the refusal is only reachable with a request sent outside the page`; 1 × `waits on the release of Maintenance Reminders`; 1 × `a tester cannot set this up through the screens: ShopView has no work order import today (PRD v1.1 S2-E3: the data import covers contacts and vehicles)`; 2 × `a tester cannot set this up through the screens: the change has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: the change finishes too fast to press twice; it needs a slowed connection a developer sets up`; 2 × `a tester cannot set this up through the screens: Close has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: Close finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: Reopen has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: Reopen finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: the same Close has to reach the sync twice, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: the hub refuses to deactivate a mapped account, so an inactive mapped account needs a database change (PRD v1.1 S6-E1)`; 1 × `a tester cannot set this up through the screens: a replay of historical events is run by the AccountingHub team, not from the screens`; 1 × `a tester cannot set this up through the screens: the migration and the operator command are run by engineering, not from the screens`; 17 × `waits on the release of the Open API story SV-11833 (built after the Open API refactoring)`; 2 × `waits on invoice creation through the Open API being enabled (disabled today, enabled for general availability)`; 1 × `a tester cannot set this up through the screens: this is the app's own request, which needs a signed-in session token a tester does not handle`; 8 × `needs records and figures noted on production before the release reaches production; run on production after the release`.
- Runnable once a build exists (marker `Not available on Build to test Yet - Last checked 11/12/2026`, Rule 69): 614.

## Coverage per source (Rule 115)

| Source | Verdict | What |
|---|---|---|
| PRD v1.0 (Confluence 942243841) | ✓ | 206 of 206 requirement codes quoted word for word; 149 of 160 named items quoted (error handling, all 42 message rows, key decisions, permission rows and rules, terminology, overview, out of scope, goals, form factor), 11 not testable with the reason |
| Jira, epic SV-11665 (28 tickets) | ✓ | every story compared with its PRD story; 13 verify tasks mapped to their cases; 52 cases quote a ticket; ticket_sweep 0 unhandled |
| Tech plan rev. 5 (2026-11-10), via TECH-PLAN-TESTABLE.json (539 CONFIRM, 131 ADD, 10 DIVERGE) | ✓ | 94 of 131 ADD statements quoted by a case (new cases or result bullets), 37 left out with the reason (below); 41 CONFIRM statements quoted where they settle a detail the PRD leaves open; no DIVERGE statement is quoted (the PRD wins); 74 invariant rows mapped to cases (below) |
| Design "Internal Work Orders · All flows v6" (version 1794484794-2031), via the design worker's drive (design-2026-11-12/) | ✓ | 89 design cases in "Design — how it looks" (one per draft: 88 runnable look cases, 0 held design-version cases, 1 a tester cannot set up); References from Design on every design case and on 314 PRD cases whose screen a board draws (132 distinct pictures, all present in images/, attached by create.py); spec-to-design table {'DIFFERENT': 48, 'NOT SHOWN': 30, 'NO SCREEN': 117, 'SHOWN': 52}; register 56 differences: 54 settled by a named PRD sentence, 0 closed by a question on the sheet, 1 (IWO-D50) by a named ruling |

- **Every surface (Rule 40):** Settings > Work Orders and the turn-on window; Customers list, header and mobile card; Edit Customer; New and Edit Asset; Administration > Service > Internal Work Orders and the category windows; New / Edit Work Order; the work order page (badge, orange card, lines, menus, Shop supplies, Finance tab, Notes, Audit Log); the work orders list, Tech View, Board, Schedule, global search, the customer's and asset's tabs; Close / Reopen and the completion steps; the NO CHARGE document in both invoice designs; estimates and invoices with a no-charge line; purchase order receiving and vendor invoices; Issue Credit; reports, the dashboard and Export Reports; QuickBooks Online and QB Unexported; AccountingHub (Account Mappings, chart of accounts, Sales > Invoices, Journal Entries, Accounting Events, sales tax and Invoice list reports); the customer portal, its approvals list, deposits, payments and emails; the Open API and webhooks; every permission matrix row.
- **Exact numbers (Rule 116):** seeded costs with the arithmetic shown, before-plus-delta report figures, and parity across the confirmation, document, report and books (DATA-01 to DATA-09). The pooled totals rate (DATA-08) is now runnable: the tech plan settles it (TP-312). The rate with no completed lines is asked (question 11).
- **What must not change (Rule 96):** INV-01 to INV-35 and REL-04 to REL-07, each quoting the PRD's own "as today" sentence (and the plan where it names the invariant). Honest limit: the baseline is what the PRD and the plan say must not change; the product code was not available to this worker, so a behaviour nobody documented cannot appear here.

## Tech plan: invariant rows (INVARIANTS-FROM-PLAN.md) and the cases that check them

| Row | Case(s) |
|---|---|
| 1.1 Create invoice on billable work orders from every place | INV-01, INV-19, S3-01 |
| 1.2 Create invoice refusal messages | REL-07 |
| 1.3 Completion wizard on billable work orders | INV-20 |
| 1.4 Credit hold still blocks Create invoice | S3-43 |
| 1.5 Header status labels | INV-15 |
| 1.6 Billable work order menu | INV-21 |
| 1.7 Change Customer on billable work orders | INV-22 |
| 1.8 Reverse | INV-02 |
| 1.9 A line added to an invoiced billable work order | INV-23 |
| 1.10 Split and move-part on billable work | INV-24 |
| 1.11 Auto-apply fees and the default discount | INV-25 |
| 1.12 Receiving on billable work | INV-26 |
| 1.13 Billable shop supplies; Min alone inert | INV-11, INV-18 |
| 1.14 Pick, receive, clock-in, approval on internal work | INV-04 |
| 1.15 A billable invoice with no mark is identical | INV-01, INV-08, INV-30 |
| 1.16 Issue Credit on billable parts | INV-12 |
| 1.17 Ordinary notes | INV-27 |
| 1.18 Invoiced / Paid filters, Completed tab | INV-28 |
| 1.19 Today's $0 invoices stay billable, with their webhooks | REL-04, S12-20, API-26 |
| 2.1 Part sales | INV-03, INV-15 |
| 3.1 New Customer and New Asset | INV-29, S1-16 |
| 3.2 Other Work Orders toggles | INV-16 |
| 3.3 Release day flags nobody | REL-01 |
| 3.4 Existing warranty flags kept | API-27 |
| 3.5 Nothing visible before the release switch | REL-05 (after launch the switch is gone; the before-launch state is not on a build a tester gets) |
| 3.6 Administration sections | INV-17, S1-84 |
| 4.1-4.3 Rule zero, every billable figure | REL-04, S9-01 to S9-07 |
| 4.4 Customers Spending for billable work | REL-04, S9-41 |
| 4.5 Customer Invoice export with the option off | S9-34 |
| 4.6 Inventory Value, Work In Progress, A/P | INV-09, S9-39 |
| 4.7 A no-charge line adds no tax and nothing owed | S9-46 |
| 4.8 Asset Invoices tab columns | S3-34 |
| 5.1 QuickBooks sync of billable work | INV-30, S7-19 |
| 5.2 QB Unexported type of billable entries | INV-31 |
| 5.3 ShopView Accounts rows keep their place | S5-01 |
| 5.4 A location without QuickBooks | S7-35 |
| 6.1, 6.3 Billable invoices and bills in the hub | INV-32 |
| 6.2 $0 invoices and replays in the hub | S8-27 (NO-MANUAL: a replay is run by the hub team) |
| 6.4 Hub Invoice List default | S8-13 |
| 6.5 Hub sales tax reports | INV-33 |
| 6.6 Existing hub pills (a Held deposit stays blue), static mapping rows | Left out: no source says how a tester produces a Held deposit in the hub; the static rows are covered by S6-01's unchanged Shop supplies row |
| 6.7 No AccountingHub | S6-06 |
| 7.1 Billable portal estimates and approvals | INV-13 |
| 7.2 Portal payments and reminders | INV-34 (payments; the overdue reminders run on a schedule a tester cannot trigger) |
| 7.3 Billable invoice webhooks and the portal's new invoice email | API-26, INV-35 |
| 8.1 Billable invoices in the Open API lists and webhooks | API-05, API-26 |
| 8.2 No Open API V1 | API-20 |

## Design (round 2b)

- **Design cases:** 89 (D-01 to D-89), made by `authoring/make_cases_design.py` from the design worker's drafts (`design-2026-11-12/tools/cases_data.py`, the data of DESIGN-CASE-PLAN.md); titles start "Design: "; every precondition list ends with the pictures to open beside the screen; every design case quotes the PRD sentence it checks and lists the boards, pictures and the design's own words under References from Design (checked word for word against the board files and the rendered text by build.py). Held design-version cases stay in "Design — how it looks".
- **Changes made to the drafts:** all READY markers -> the Rule 69 marker (no build yet); DV markers name the merged questions: DV-01 -> 12, DV-02 -> 3, DV-03 -> 13, DV-04 -> 14, DV-05 -> 15, DV-06 -> 16; quotes: (code, opening words) -> that requirement's whole sentence, verbatim; §8-NN -> UFS-NN; precondition 'Open the attached picture(s) ... at 100% zoom beside the screen.' added (as in the plan); '<number>' placeholders -> '[number]' with the square-bracket note; Rule 137: a 'Have a new / closed / invoiced ... work order' bullet ends ', made for this test.' (a record the case changes is fresh); notes: design question numbers -> merged numbers; case ids -> plain words; DC-44: the draft's 'turn the browser offline' step dropped and the case marked as one a tester cannot set up, the same ruling as the PRD case for a failed Close (round 1): a dropped network also stops the window loading, so the failure the PRD names cannot be made by hand; kept out of TestRail with the other cases a tester cannot set up; DC-50: hold 'AUTOMATION: HOLD - waiting on the PO (Total balance No Charge or $0.00)' lifted (settled in round 2a, question dropped); DC-72 results: 'The invoice is created as today.' -> 'The invoice is created and shows on the Finance ta'.
- **PRD cases:** 314 carry References from Design: the case's primary PRD code (the screen it is about) is SHOWN or DIFFERENT on a board; boards come from the spec-to-design table's own board names, then the design cases that quote the same code (at most 4 pictures); a difference on any quoted code adds a note naming its register row and how it is closed. API cases and cases whose screen no board draws carry no heading.

| Register row (open) | Closed by |
|---|---|
| IWO-D50 | named ruling, no question: two reviewer remarks left in the file of Review board 1.1, below its visible area; PRD Final v1.0 is newer than the design and its header says "Where a frame and this text disagree, the text wins"; it already gives the toggle description (S1-R1) and the No Charge badge in its own style (S2-R3), which is what the remarks ask; no verdict depends on them |

The other 54 rows are settled by the PRD sentence the register names; the cases follow the PRD and name the row in their References from Design.

## Round 2c (coordinator's review): every result has a baseline the tester can see, and no plan quote is code

- **84 cases changed** (one of them, S2-105, retired). A result that judged against "as before", "as today", "where it was", "unchanged" or "as usual" now names what the tester sees (most), notes the value in an earlier step of the same case (S1-44, S12-05, INV-24), compares with the same screen on production where the feature is not released yet (S1-84, INV-02, INV-15, INV-17, INV-21), or compares with what was noted before the release on production (REL-02, REL-03; PROD folder). build.py now refuses those words in any result.
- **Plan quotes:** 48 plan statements whose saved quote carried code or a file path are now quoted only by the code-free behaviour wording of the same plan line; 19 had none and were dropped (the cases rely on the PRD; a bullet only the code backed was removed; the ADD ones are listed under "ADD statements left out"). build.py refuses any plan quote that carries code.
- Folders (coordinator, 12 Nov 2026): WAIT-PO "Waiting on Milos Vasic's answers", BLK "Blocked on the Open API release", BLK-MR "Blocked on the Maintenance Reminders release", PROD "Run on Production After Release".

| Case | What changed (Rule 134: the case was rebuilt whole) |
|---|---|
| S2-42 | baseline named: '"Save" is enabled although the category is unchanged.' -> '"Save" is enabled although Category still shows Warranty.' |
| S1-14 | baseline named: 'Nothing on the tab is required or blocked: Save settings works as usua' -> 'Nothing on the tab is marked as required and no control on it is greye' |
| S1-44 | title: 'Deleting a flagged customer with no work orders removes it as usual' -> 'A flagged customer is deleted or refused by the same rules as any customer'; precondition added: 'Have a new customer for this test, customer C, not flagged, with one o'; steps 3-4 added: a regular customer with an open work order shows today's refusal; step 6 compares with it |
| S1-64 | baseline named: 'Have a second user for this test with access to both locations, so the' -> 'Have a second user for this test with access to both locations.'; precondition added: 'Have Goodwill mapped at location B to an expense account, account B, s'; the location B check split into its own steps, against account B set in the preconditions |
| S1-76 | baseline named: 'is not available to this user, as today.' -> 'is not available to this user.' |
| S1-78 | baseline named: 'with no Edit Customer, as today, so' -> 'with no Edit Customer, so' |
| S2-79 | baseline named: 'with a portal contact.' -> 'with a portal contact whose portal login the tester can use.'; 'sent to the portal as today' replaced by opening the sent estimate in the portal (steps 3-4) |
| S3-24 | precondition removed: "Note customer A's balance."; baseline named: "Customer A's balance is the same as before: the $15.00 of shop supplie" -> "Customer A's balance reads $0.00: the $15.00 of shop supplies is not c" |
| S3-36 | baseline named: '"Mark Reviewed" works as today.' -> 'The work order is marked reviewed and leaves Review.' |
| S3-43 | baseline named: 'is refused, as today, with' -> 'is refused with' |
| S3-53 | baseline named: 'The work order stays where it was and nothing is posted.' -> 'Work order 1 is not Closed and nothing is posted.' |
| S4-09 | baseline named: 'The vendor bill is still there for $125.00, unchanged.' -> "The vendor bill is still there for $125.00, on work order 1's part." |
| S5-12 | baseline named: 'is not available to this user, as today.' -> 'is not available to this user.' |
| S5-14 | baseline named: 'When the save fails, the existing QuickBooks settings error handling s' -> 'When the save fails, the QuickBooks page shows the error it shows for ' |
| S6-06 | baseline named: 'is not offered, as today, so' -> 'is not offered, so' |
| S6-07 | baseline named: 'is not available to this user, as today.' -> 'is not available to this user.' |
| S6-08 | baseline named: 'When the save fails, the existing Account Mappings error handling show' -> 'When the save fails, Account Mappings shows the error it shows for any' |
| S7-07 | baseline named: 'The vendor, the bill and Accounts Payable are as usual.' -> 'The bill keeps its vendor and its $125.00 total and credits Accounts P' |
| S7-18 | baseline named: 'Have a new customer for this test, customer A.' -> 'Have a new customer for this test, customer A, with its own labor rate'; baseline named: '(one approved labor line of 2.0 hours)' -> '(one approved labor line of 2.0 hours at $120.00 an hour)'; baseline named: 'The invoice is created as today.' -> 'The invoice is created and shows on the Finance tab.'; baseline named: 'Line 1 is invoiced as today.' -> 'Line 1 is on the invoice with its 2.0 hours at $240.00 (2.0 h × $120.0' |
| S7-19 | baseline named: 'Cost of Parts $30.00, as today.' -> 'Cost of Parts $30.00.' |
| S8-07 | baseline named: 'The bill is saved and can be paid as usual.' -> 'The bill is saved.'; step 2: result added: 'Only the move is Held: no Held row is listed for the bill itself, so t'; result removed (backed only by code): 'The Held pill is amber.'; plan quote(s) TP-395, TP-497 dropped: the plan states them only in code or a test-file path |
| S8-16 | baseline named: 'goods sold account as today.' -> 'goods sold account mapped on Account Mappings.' |
| S9-34 | baseline named: "The file has today's columns, with no Classification or Category colum" -> 'The file has no Classification column and no Category column.'; title: "With the option off, the export is today's file" -> 'With the option off, the export has no internal rows or columns' |
| S9-37 | baseline named: 'Have technician A for this test.' -> 'Have technician A for this test, with no time clocked to a department.'; baseline named: 'The "Internal Hours" column is unchanged: it counts time clocked to a ' -> 'Technician A\'s "Internal Hours" shows no hours: the 2.0 hours on work ' |
| S9-43 | baseline named: 'are not available to this user, as today.' -> 'are not available to this user.' |
| S10-04 | baseline named: 'disabled until a percentage is entered, as today.' -> 'disabled because no percentage is entered.' |
| S10-13 | baseline named: 'When the save fails, the existing shop supplies error handling of the ' -> 'When the save fails, an error shows and "Shop supplies" does not keep ' |
| S12-05 | step 1: result added: 'Financial Info shows its cost figures; note them.'; baseline named: 'Financial Info, the cost view, is unchanged.' -> 'Financial Info shows the same cost figures as noted in step 1.' |
| S12-16 | baseline named: 'The invoice is created as today.' -> 'The invoice is created and shows on the Finance tab.' |
| S12-36 | baseline named: 'line 1 prints as today.' -> 'line 1 prints with no chip.' |
| S12-42 | baseline named: 'line 2 stays as it was.' -> 'line 2 keeps its price and shows no chip.' |
| S12P-02 | baseline named: 'The approval is recorded, as today.' -> 'The estimate shows as approved.' |
| S12P-05 | baseline named: 'Approve works as today.' -> 'The estimate shows as approved.' |
| API-20 | baseline named: 'The request is refused as today, with no new fields to see.' -> 'The request is refused because Open API V1 is not enabled: no work ord' |
| API-26 | baseline named: 'The $0 invoice is created and paid as today.' -> 'The $0 invoice is created and shows as Paid.'; plan quote(s) TP-304 dropped: the plan states them only in code or a test-file path |
| REL-01 | baseline named: 'The "Internal Work Orders" toggle is off and nothing new shows on the ' -> 'The "Internal Work Orders" toggle is off and no hint line shows under ' |
| REL-02 | precondition added: "Before the release, note the rows and their accounts on this location'"; baseline named: 'the other rows are as they were.' -> 'the other rows and their accounts are the ones noted before the releas' |
| REL-03 | baseline named: 'Every mapping noted before the release that was valid is unchanged.' -> 'Every mapping noted before the release that was valid still points at '; baseline named: 'that account is unchanged.' -> 'that account keeps its name and number.' |
| INV-01 | baseline named: 'The invoice is created as today, with no confirmation window, for $240' -> 'The invoice is created at once, with no confirmation window, and shows' |
| INV-02 | precondition added: 'Have a second browser window signed in as an Admin to the production t'; precondition added: 'In that production window, have a new invoiced billable work order for'; 'reversed as today' compared with Reverse on production (steps 5-8) |
| INV-03 | baseline named: ', and is invoiced as today.' -> '.' |
| INV-04 | baseline named: 'The line is approved as on a billable work order.' -> 'The line shows as approved.' |
| INV-05 | baseline named: 'with no prices, as it does today.' -> 'with no prices.' |
| INV-07 | baseline named: '(2.0 h × $150.00), as today.' -> '(2.0 h × $150.00).' |
| INV-08 | baseline named: 'Have a new customer for this test, customer A.' -> 'Have a new customer for this test, customer A, with its own labor rate'; baseline named: 'The invoice shows its prices and totals as today, with no NO CHARGE st' -> 'The invoice shows the line at $240.00 (2.0 h × $120.00) and its totals' |
| INV-10 | baseline named: 'The deposit window opens as today.' -> 'The deposit window opens.'; baseline named: 'The $50.00 deposit is recorded as today.' -> 'The $50.00 deposit is listed on the Finance tab.' |
| INV-11 | baseline named: '(10% of $240.00), as today.' -> '(10% of $240.00).' |
| INV-12 | baseline named: 'with the restocking fee option, as today.' -> 'with the restocking fee option.' |
| INV-13 | baseline named: 'The line card shows $240.00 and the price summary as today, with no st' -> 'The line card shows $240.00 (2.0 h × $120.00) and the price summary in' |
| INV-14 | baseline named: '"Create invoice" is offered, as today.' -> '"Create invoice" is offered.' |
| INV-15 | baseline named: 'The header status reads as before (Review).' -> 'The header status reads Review.'; precondition added: 'Have a second browser window signed in as an Admin to the production t'; precondition added: 'In that production window, have a new open part sale for this test, pa'; baseline named: 'The part sale header reads as before.' -> 'The part sale header shows its status with no Closed, Internal or No C'; step 3 added: the part sale's status label compared with production |
| INV-16 | baseline named: 'The settings are saved as before.' -> 'The settings are saved, with no window and no message about Internal W'; plan quote(s) TP-020 dropped: the plan states them only in code or a test-file path |
| INV-17 | title: 'Administration sections are where they were' -> 'Administration shows the same sections as production, plus one tab'; rewritten: 'where it was before' compared with Administration on production; precondition for the production window added; plan quote(s) TP-199 dropped: the plan states them only in code or a test-file path |
| S1-84 | 'the other Service tabs are where they were' compared with production (step 2); plan quote(s) TP-199 dropped: the plan states them only in code or a test-file path |
| INV-19 | baseline named: '"Create invoice", as today.' -> '"Create invoice".'; baseline named: 'The invoice is created as today.' -> 'The invoice is created and shows on the Finance tab.'; plan quote(s) TP-125 dropped: the plan states them only in code or a test-file path |
| INV-20 | baseline named: 'with one part that carries a core.' -> 'with one part that carries a core of $50.00.'; baseline named: 'The core step shows the core amount, as today.' -> "The core step shows the part's $50.00 core." |
| INV-21 | precondition added: 'Have a second browser window signed in as an Admin to the production t'; precondition added: 'In that production window, have a new billable work order for this tes'; baseline named: 'The menu shows Audit Log, Timesheets, "Add Work Order Fee / Discount",' -> 'The menu shows "Convert to No Charge" among its items; note the items '; title: "A billable work order's menu is as before plus Convert to No Charge" -> "A billable work order's menu matches production plus Convert to No Charge"; the menu list (not in any source) replaced by a comparison with the same menu on production (steps 3-4) |
| INV-22 | baseline named: 'Change Customer is refused for the deposit, as today.' -> 'Change Customer is disabled, with a tooltip about the deposit.'; baseline named: 'offers no Change Customer, as today.' -> 'offers no Change Customer.' |
| INV-23 | baseline named: 'for the line, as today.' -> 'for the line.'; plan quote(s) TP-373 dropped: the plan states them only in code or a test-file path |
| INV-24 | baseline named: 'Work order 1 opens.' -> 'Work order 1 opens; its second line shows $240.00 (2.0 h × $120.00).'; baseline named: 'The moved line shows $240.00, as before the split, and no badge.' -> 'The moved line shows $240.00, as it did in step 1, and no badge.' |
| INV-25 | baseline named: 'and the 5% discount, as today.' -> 'and the 5% discount.' |
| INV-26 | baseline named: '"Updating the cost also updates the sell price", as today.' -> '"Updating the cost also updates the sell price".'; baseline named: 'The sell price preview updates from the new cost, as today.' -> 'The sell price preview changes to a price worked out from the $60.00 c' |
| INV-27 | baseline named: 'its edit menu, as today;' -> 'its edit menu;' |
| INV-28 | baseline named: 'Work order 3 is listed, as today.' -> 'Work order 3 is listed.' |
| INV-30 | baseline named: 'Cost of Parts, as today.' -> 'Cost of Parts.' |
| INV-31 | baseline named: '"Work Order Create", as today.' -> '"Work Order Create".' |
| INV-32 | baseline named: 'The record is listed with its status as today.' -> 'The record is listed with no "Closed" pill and no "Internal" or "No Ch'; baseline named: 'The record has no "No Charge lines" block and its entries post as toda' -> 'The record has no "No Charge lines" block and none of its entries post' |
| INV-34 | baseline named: 'The payment is taken and recorded in ShopView, as today.' -> "The portal confirms the payment, and work order 1's invoice shows Paid" |
| INV-35 | baseline named: "The portal's new invoice email has arrived, as today." -> "The portal's new invoice email for work order 1 has arrived." |
| S2-22 | result reworded to the plan's behaviour words: 'The "Internal" badge is filled orange; the "No Charge" badge is outlin' -> 'The "Internal" badge is filled; the "No Charge" badge is outlined.' |
| S2-24 | result reworded to the plan's behaviour words: 'The third column is headed "Cost"; no Labour type column shows.' -> 'The third column is headed "Cost".' |
| S2-67 | result reworded to the plan's behaviour words: 'The "Closed" status shows in a neutral grey; the orange is only on the' -> 'The "Closed" status shows in a neutral colour, not orange; the orange ' |
| S6-01 | result removed (backed only by code): 'The Internal row comes first, then the No Charge rows by name: Comebac'; plan quote(s) TP-600 dropped: the plan states them only in code or a test-file path |
| S8-01 | result removed (backed only by a code file reference): 'The "Closed" pill is grey.'; plan quote(s) TP-635 dropped: the plan states them only in code or a test-file path |
| S8-03 | result removed (backed only by code; the first bullet already says Inventory): 'The credit side is account 1300 (Inventory).'; result removed (backed only by code; the PRD's source wording is in the first bullet): 'Its source document reads "Internal work order [number]".'; plan quote(s) TP-614, TP-604 dropped: the plan states them only in code or a test-file path |
| S8-04 | result removed (backed only by code; the PRD's source wording is in the first bullet): 'Its source document reads "No-charge work order [number]".'; plan quote(s) TP-604 dropped: the plan states them only in code or a test-file path |
| S8-30 | result reworded (the suffix was backed only by code): 'The first record is Void with its number suffixed; a new Closed record' -> "The first record is Void; a new Closed record carries work order 1's n"; plan quote(s) TP-579 dropped: the plan states them only in code or a test-file path |
| S9-09 | result removed (backed only by a code constant): 'The date presets include "Last 12 months".'; plan quote(s) TP-507 dropped: the plan states them only in code or a test-file path |
| API-27 | plan quote(s) TP-057 dropped: the plan states them only in code or a test-file path |
| REL-07 | plan quote(s) TP-064 dropped: the plan states them only in code or a test-file path |
| S6-09 | plan quote(s) TP-093 dropped: the plan states them only in code or a test-file path |
| S1-85 | plan quote(s) TP-270 dropped: the plan states them only in code or a test-file path |
| S1-67 | plan quote(s) TP-347 dropped: the plan states them only in code or a test-file path |
| S2-105 | retired: its only source for the footer total is a code reference (TP-522); the "No Charge" Total Price check stays in the other work orders list cases |

## Tech plan: DIVERGE items

- D-1 (Create invoice rows per move or per account pair): S7-38 written and held on question 4; S7-12, S7-22 and S7-23 have one move each, where both readings agree, so they stay runnable.
- D-2 ("Closed" in the Status filter only after first use): S2-106 written and held on question 5; S2-68 runs in a shop that uses the feature, where both agree.
- D-3 (the message when a completion step fails inside Close): no runnable case depends on it (S3-53 is NO-MANUAL); not asked (skill 07 §6), reported here for the QA lead.
- D-4 (no live work order import): S2-90 held on question 6.
- D-5 to D-9: the cases follow the PRD, no hold ("No charge" vs "No Charge" in two plan lines, an old report name, account 6510, the release-run order).
- Code facts: the hub refuses to deactivate a mapped account (S6-10 and S8-26 held on question 8); the portal deposit race (S12P-11 held on question 7); line marks after converting back (S2-100 held on question 9).

## Tech plan: ADD statements left out

| Statement | Why |
|---|---|
| TP-003 | 10,000-row export cap per tab: a tester would need more than 10,000 report rows. |
| TP-005 | 500 work orders per Make internal call: an internal batching detail; seen only with more than 500 open work orders. |
| TP-112 | A customer with more than 500 open work orders: not a setup a tester can make by hand. |
| TP-345 | Export refused above 10,000 rows: not a setup a tester can make by hand. |
| TP-228 | The VIN-change path re-resolving the category: a code path; the asset-change case (S2-05) checks what a tester sees. |
| TP-252 | An entry that posts nothing never reaches QB Unexported: nothing to look at. |
| TP-256 | The hub creating a missing category row from a message: only reachable with a message a tester cannot send. |
| TP-293 | The review-required refusal copy: with review on, Close is not offered (S3-36), so the message cannot be reached through the screens. |
| TP-357 | System notes never customer-visible: no portal screen shows work order notes, so there is nothing to look at. |
| TP-363 | A manual payment change on a closed record refused: New Payment is not offered (S2-103), so only a request outside the screens reaches it. |
| TP-364 | Search reindex is a release step; S2-73 checks the badge in search after the release. |
| TP-402 | Header card colour tokens: token names are not visible to a tester; the orange outline and light orange background are compared with the design's pictures by the design cases D-55 and D-77 (round 2b). |
| TP-462 | Mobile Close icon name (task_alt): an icon name is not visible, and the design draws no phone Close button to compare it with (round 2b); S3-04 checks its tooltip. |
| TP-506 | Hub register short codes IWO, NCWO, NCL: the plan does not say which screen shows them. |
| TP-525 | Schedule compact block label: the design draws only the full Schedule card (D-80 checks its badge, round 2b), and no source says how a tester brings up the compact block, so it cannot be reached reliably by hand. |
| TP-594 | Held rows in the hub's reconciliation run: an operator command output, not a screen. |
| TP-605 | Hub write-off refused on a Closed record: the record has no write-off tab (S8-02), so only a request outside the screens reaches it. |
| TP-607 | A rerun never refills a cleared starting row: the operator command is run by engineering (S13-06). |
| TP-624 | A rerun re-maps an inactive starting account: the operator command is run by engineering. |
| TP-639 | Vendor credit amend and void: the plan says they cannot happen; nothing to test. |
| TP-648 | A direct portal link to a closed record's invoice: a tester has no such link (the record is never listed). |
| TP-652 | Portal batch pay naming a closed record: the record is never listed, so it cannot be picked. |
| TP-419 | A direct link to the categories page while the release switch is off: only before launch; not on a build a tester gets. |
| TP-020 | Stated only as a request path and setting key; INV-16 checks the behaviour from the PRD (KD-ORG) and TP-547. |
| TP-093 | Stated only through code names; S6-09 quotes the same behaviour from TP-496. |
| TP-199 | A note about a test file, not a behaviour; S1-84 and INV-17 compare Administration with production. |
| TP-270 | Stated only through a table name; S1-85 checks the field from the PRD (S1-R15). |
| TP-347 | Stated only as a request parameter; S1-67 checks archived categories from the PRD (S1-R16, S12-E4). |
| TP-395 | A colour key in code; the Held state is checked from the PRD (S8-N2) and against the design picture (D-84). |
| TP-497 | A colour entry in code; as TP-395. |
| TP-507 | A code constant (date presets); the 12-month limit is quoted from TP-344. |
| TP-522 | The footer total is stated only through a component file and field; S2-105 retired. |
| TP-579 | The number suffix is stated only through code names; S8-30 checks Void and the new record from TP-626. |
| TP-600 | The row order is stated only through code keys; the bullet was removed from S6-01. |
| TP-604 | A code call; the source wording is quoted from the PRD (S8-R2) in S8-03 and S8-04. |
| TP-614 | Account numbers inside a code sentence; S8-03 checks the posting from the PRD (S8-R2). |
| TP-635 | A code file reference (grey pill); S8-01 checks the Closed record from the PRD. |

## Existing cases changed in round 2a (Rule 134: each changed case was rebuilt whole by build.py; the parts that changed)

| Case | Change |
|---|---|
| S1-28 | step 4: added 1 result bullet(s); quotes TP-272 |
| S1-50 | step added: 'Hover over Archive in the menu.'; quotes TP-409 |
| S1-51 | plan quote added: TP-418, TP-410, TP-128 |
| S1-62 | step 3: added 1 result bullet(s); quotes TP-411 |
| S1-63 | step 3: added 1 result bullet(s); quotes TP-411 |
| S1-67 | plan quote added: TP-347 |
| S2-13 | step 6: added 1 result bullet(s); quotes TP-401, TP-142 |
| S2-22 | step 2: added 1 result bullet(s); quotes TP-398 |
| S2-24 | step 1: added 1 result bullet(s); quotes TP-453, TP-528 |
| S2-52 | plan quote added: TP-043 |
| S2-53 | result rewritten from the plan; quotes TP-152 |
| S2-54 | result rewritten from the plan; quotes TP-450 |
| S2-67 | step 2: added 1 result bullet(s); quotes TP-397 |
| S3-18 | step 3: added 1 result bullet(s); quotes TP-463 |
| S3-26 | step 2: added 1 result bullet(s); quotes TP-679 |
| S3-43 | result rewritten from the plan; quotes TP-475 |
| S4-05 | step 5: added 1 result bullet(s); quotes TP-473 |
| S5-01 | step 2: added 3 result bullet(s); quotes TP-421, TP-247, TP-130 |
| S5-02 | step 3: added 1 result bullet(s); quotes TP-037, TP-351 |
| S5-09 | plan quote added: TP-349 |
| S6-01 | step 1: added 1 result bullet(s); quotes TP-600 |
| S7-03 | step 4: added 1 result bullet(s); quotes TP-249 |
| S7-31 | plan quote added: TP-029, TP-085 |
| S8-01 | step 4: added 1 result bullet(s); quotes TP-635 |
| S8-03 | step 4: added 3 result bullet(s); quotes TP-614, TP-604, TP-631 |
| S8-04 | step 4: added 1 result bullet(s); quotes TP-604 |
| S8-07 | step 2: added 2 result bullet(s); quotes TP-497, TP-395, TP-500 |
| S8-09 | result rewritten from the plan; quotes TP-056, TP-598 |
| S8-10 | result rewritten from the plan; quotes TP-056 |
| S8-16 | step 3: added 2 result bullet(s); quotes TP-557, TP-585 |
| S8-18 | step 4: added 1 result bullet(s); quotes TP-498 |
| S8-23 | step 5: added 1 result bullet(s); quotes TP-592 |
| S8-25 | plan quote added: TP-638 |
| S9-09 | step 2: added 1 result bullet(s); quotes TP-507, TP-344, TP-098 |
| S9-11 | step 2: added 1 result bullet(s); quotes TP-509 |
| S9-17 | result rewritten from the plan; quotes TP-511 |
| S9-26 | step 4: added 1 result bullet(s); quotes TP-021, TP-097 |
| S9-39 | step 1: added 1 result bullet(s); quotes TP-516 |
| S12-18 | step 2: added 1 result bullet(s); quotes TP-489 |
| S12-26 | result rewritten from the plan; quotes TP-328, TP-481 |
| S12-33 | step 3: added 1 result bullet(s); quotes TP-490 |
| S12P-06 | step 7: added 2 result bullet(s); quotes TP-673, TP-658 |
| S12P-10 | step 2: added 1 result bullet(s); quotes TP-650 |
| REL-03 | step 2: added 2 result bullet(s); quotes TP-608, TP-636, TP-613 |
| S2-90 | held on PO question 'import' (DIVERGE D-4: the plan says no live work order import exists) |
| S8-26 | held on PO question 'hub-inactive-account' (DIVERGE-adjacent code fact: the hub refuses to deactivate a mapped account) |

Also changed in round 2a: S3-34 released (question "asset tab total" settled by the plan: TP-174 "No Charge") and DATA-08 released (TP-312). Every other part of every case (title, preconditions, steps, other results, PRD quotes and From lines, build line, marker, refs) was rebuilt by build.py from the same source and is CONFIRMED.

## Story text (Jira) compared with PRD v1.1

Every story ticket says "Requirements, negative cases and edge cases live in the spec"; its one-paragraph summary was compared with the PRD story. Latest wins (Rule 32): PRD v1.1 of 12 Nov 2026 (Final v1.0 of 9 Nov 2026 with Milos Vasic's answers 1-16 carried in the text). No story needs a PO question; the verify task SV-11976's "$0.00" is settled by the plan ("No Charge").

| Ticket | Verdict | Difference |
|---|---|---|
| SV-11665 | DIFFERS (older wording) | The epic summary names the setting "No-Charge Work Orders", a "No charge checkbox with a reason", a "No-Charge Work Orders report", and links PRD v0.16 and design v5.11. PRD v1.1 (latest, Final, 9 Nov 2026) names the setting and the report "Internal Work Orders", replaces Reason by Category (Terminology: "Reason → the earlier name ... Superseded by Category") and links design v6.1. Latest wins (Rule 32): cases follow PRD v1.1. Not asked: the PRD itself records the rename. |
| SV-11758 | DIFFERS (older wording) | Summary says "The No-Charge Work Orders setting"; PRD v1.1 S1-R1 names the toggle "Internal Work Orders". Everything else matches Story 1. Cases follow PRD v1.1. |
| SV-11759 | DIFFERS (older wording) | Summary says "the No charge checkbox with its Reason" and "Convert to no charge, Convert to billable and Change reason"; PRD v1.1 S2-R2, S2-R5, S2-R6: "No Charge" checkbox with Category, "Convert to No Charge", "Convert to Billable", "Change category" (Title Case). Cases follow PRD v1.1. |
| SV-11760 | SAME | Summary matches Story 3. |
| SV-11761 | SAME | Summary matches Story 4. |
| SV-11762 | DIFFERS (superseded design) | Summary says "Two rows ... Internal Work Orders Expense and No-Charge Work Orders Expense"; PRD v1.1 S5-R1: one row per category (Terminology: "Replaces the two fixed rows Internal Work Orders Expense and Customer No-Charge Expense of v0.17"). Cases follow PRD v1.1. |
| SV-11763 | DIFFERS (superseded design) | Summary says "Two mapping keys ... with seeded defaults"; PRD v1.1 S6-R1/S6-R2: one row per category with the starting mappings 6500, 6430, 6440. Cases follow PRD v1.1. |
| SV-11764 | SAME | Summary matches Story 7. |
| SV-11765 | SAME | Summary matches Story 8. |
| SV-11766 | DIFFERS (older wording) | Summary says "the new No-Charge Work Orders report with its Reason filter, and the invoice export option with the Classification and Reason columns"; PRD v1.1 S9-R2/S9-R6: "Internal Work Orders" report with a Category filter; export columns Classification and Category. Cases follow PRD v1.1. |
| SV-11767 | SAME | Summary matches Story 10. |
| SV-11833 | DIFFERS (older wording) | Summary says "a read-only classification and reason"; PRD v1.1 S11-R1: classification and category. Cases follow PRD v1.1. Both say Story 11 is built after the Open API refactoring: its cases open with a BLOCKED ON RELEASE line. |
| SV-12226 | SAME | Summary matches Story 12. |
| SV-12295 | DIFFERS (resolved since) | Summary says "Comeback Expense at the number the hub owner confirms"; PRD v1.1 S6-R2 and S13 prerequisites: 6440 Comeback Expense, confirmed 9 Nov 2026. Cases use 6440. |
| SV-12296 | SAME | Summary matches the portal requirements it lists (S2-R11, S2-E6, S1-R11, S3-R4, S12-R4, S12-R7); it notes design frame 7b is being redrawn (the text wins). |

Verify tasks (developer check-lists), read in full:

| Ticket | Cases | Note |
|---|---|---|
| SV-11973 | REL-04, REL-05, INV-01, S9-01, S9-02, S9-03, S9-04 | Developer check-list for the foundation (schema, shared predicates, invoice-create extraction). Tester-visible parts: rule zero (REL-04) and nothing visible while the release switch is off (REL-05). The migration diff and the extraction are code checks with no screen. |
| SV-11974 | S1-*, S10-04 | Covers Story 1 and S10-R1: every Story 1 case. |
| SV-11975 | S2-*, S10-* | Covers Story 2 and Story 10. Its item 5 adds "the server refuses Change Customer without 'Work Orders — Create & Edit'": a server refusal with no screen, listed with S1-82 in NO-MANUAL-PROPOSAL.md (PM-R1). |
| SV-11976 | S3-*, S4-*, S3-48, API-02 | Covers Stories 3 and 4. Its item 7 says the asset's Invoices tab lists the closed record "at $0.00" where PRD v1.0 S3-R6/S9-R10 say Total balance "No Charge": settled by the tech plan, which builds "No Charge" (TP-174); S3-34 follows the PRD and is runnable. Its item 5 (a refused Close leaves the work order where it was, not Complete) is quoted by S3-48. |
| SV-11977 | S5-*, S7-*, S12-33 | Covers Stories 5 and 7. Its item 7 adds that the void of an Issue Credit restock posts the reverse; S12-33 quotes the item; the void has no PRD sentence and no plan statement a tester can reach, so it has no case. |
| SV-11978 | S6-*, S8-* | Covers Story 6 and the hub side of Story 8. Its item 3 adds the Dismissed reason wording ("Withdrawn: vendor bill [number] amended" or "… voided"), quoted by S8-09. |
| SV-11979 | S8-*, S3-41, S13-04 | Core accounting emission and the accounting UI port. Tester-visible parts are the Accounting pages (Story 8 cases) and the AccountingHub notes in the Close confirmation (S3-41). The contract package versions are a code check with no screen. |
| SV-11980 | S9-*, DATA-* | Covers Story 9: every Story 9 case and the number parity cases. |
| SV-11981 | REL-*, S13-* | Release run and launch: the release-day cases (production) and the new-organization cases. The run order and the operator command are engineering steps (S13-06, NO-MANUAL). |
| SV-12297 | REL-04 | Rule zero before and after: REL-04 (production, figures kept before the release). |
| SV-12420 | S1-45, S1-46, S1-47, S1-50, S1-51, S1-53, S1-54, S1-56, S1-59, S1-64, S5-01, S13-01, S13-03 | Categories page, QuickBooks rows, seeding. |
| SV-12421 | S12-* | Covers Story 12 core. Item 3 says Mark as No Charge on an invoiced work order is "disabled with 'Reverse the invoice first.'", PRD S12-N3 says the menu offers neither action and the tooltip reads the same words: S12-26 checks both. Item 6's server refusal of a restocking fee has no screen. |
| SV-12422 | S12P-* | Covers the portal. Its item 6 (a portal deposit refused after checkout is recorded with its own reason and can be refunded) had no PRD v1.0 sentence and is now PRD v1.1 S2-E8 (Milos Vasic's answer 7); the tech plan gives its message (TP-668) and the race behind it is asked: S12P-11, held on question 7. |

## Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| PRD `sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0) | 805 lines, 179,770 bytes | lines 1–805, 100% |
| PRD `sources/CONFLUENCE-942243841-v1.1-read-2026-11-12.md` (v1.1, 12 Nov 2026) | 182,519 bytes | the 34 changed lines (`po-answers-2026-11-12/PRD-DIFF-v1.0-to-v1.1.txt`) read in full, and every requirement, message row and named item re-parsed from v1.1 by script and compared with v1.0 (16 changed items, 1 new requirement S2-E8, 1 new message row); the other lines are byte-identical to v1.0, read in full in round 1 |
| Milos Vasic's answers (`po-answers-2026-11-12/ANSWERS-Milos-Vasic-2026-11-12.json`), QUESTION-REVIEW.md, AFFECTED-CASES.json, the design worker's DESIGN-CHANGE-2026-11-12.md, skill 07 §6.0 | — | in full |
| Jira `sources/JIRA-SV-11665-tickets-2026-11-12.md` (epic, 14 stories, 13 verify tasks, fetched in full) | 454 lines | 1–454, 100% |
| Tech plan worker's outputs: TECH-PLAN-TESTABLE.json (680 statements and 8 context lines), TECH-PLAN-DIVERGENCES.md, INVARIANTS-FROM-PLAN.md, QUESTIONS-DRAFT.md, TECH-PLAN-READING-RECORD.md, NOTES.md | 259 KB + 45 KB | every statement and line, 100% |
| The tech plan itself (842 KB, 5,398 lines) | — | read in full by the tech plan worker (its reading record); this worker re-checks every quoted statement against its plan line by script |
| Design worker's outputs: tools/cases_data.py (every draft, DC-01 to DC-86 and DV-01 to DV-06, read in full), NEW-QUESTIONS.py (in full), DESIGN-DIVERGENCE-REGISTER.json (every row), SPEC-TO-DESIGN-2026-11-12.json (247 rows), DESIGN-FIGURES-2026-11-12.json (167 boards), tools/make_case_plan.py and tools/prd.py (in full) | — | 100%; DESIGN-CASE-PLAN.md is rendered from cases_data.py by make_case_plan.py, so its content was read through its data; build.py checks the case count equals the drafts |
| Rules and skills: LESSONS-REGISTER.md; Rule 4; Rules 96, 113–117 (all amendments), 122, 123, 129, 130, 132–140; IDEAL-TEST-CASE-STANDARD.md; skill 17 §0–2; skill 07 §2–6 | — | in full |

## Checks run

- `python3 authoring/build.py`: 0 PROBLEM lines; proposals.json (664 cases). New gates: every tech plan quote is word for word on its plan line, no DIVERGE statement is quoted, every ADD statement is quoted or listed as left out.
- `tester_readiness_check.py`: 0 hard problems. Round 1 read a sample of 6 and all 112 "does not / never" results; round 2a read a new sample of 6 (S1-88, S4-12, S2-28, S7-36, S12-35, S7-32) and every new "does not / never" result (13). Changes from the read: S12P-12 rewritten with a visible control and one action per step, an unneeded labor rate removed from S12-35.
- Round 2b: build.py adds the design gates (pictures exist, the design's words are on the case's boards, every open register row is closed by a sheet question or the named ruling, one case per design draft). Readiness: 0 hard; the sample read (D-72, S1-15, S5-05, S2-52, S3-33) and every "does not / never" result of the design cases (19) and of the rest (140 in all) read; each has its positive control in the same case.
- Round 2c: build.py adds the baseline-word gate and the code-in-plan-quote gate. Readiness re-run: 0 hard; the new sample and every "does not / never" result (145) read again.
- `ticket_sweep.py`: 0 unhandled tickets, PRD 1.0 handled. `create.py` dry run: nothing written.

## OUTSTANDING — what I need from you

- **Go-ahead for the round 3 writes (Rule 6):** run, in order, `po-answers-2026-11-12/write/update_cases.py --apply`, `create_new.py --apply`, `delete_three.py --apply`, `sync_run_559.py --apply` (each is a dry run without the flag and reads every write back).
- **Recommended: delete S2-90 [C1112004](https://shopview.testrail.io/index.php?/cases/view/1112004), S8-26 [C1112153](https://shopview.testrail.io/index.php?/cases/view/1112153)** — PRD v1.1 makes them impossible to run by hand (no work order import; the hub refuses the deactivation). Until you decide, the update script leaves them as they are.
- **NO-MANUAL:** confirm the 22 cases stay out of TestRail (recommended, as for Bill To).
- **For the QA lead only (Rule 30):** the plan-vs-PRD differences D-3 and D-5 to D-9 above need no PO answer; the cases follow the PRD.
- **Waiting on the PO (Rule 132):** no unanswered question (all 16 answered 12 Nov 2026). One confirmation is pending from the Open API owner, not the PO: question 10 (work_order.updated), case API-23, still blocked on the Open API release.
- **No QA branch is named:** every runnable case carries the Rule 69 marker until a build is checked.
