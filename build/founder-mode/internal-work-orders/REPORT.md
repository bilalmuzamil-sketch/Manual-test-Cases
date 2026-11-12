# Internal Work Orders — report, rounds 1, 2a and 2b (PRD, Jira, tech plan, design), 12 Nov 2026

Worker: PRD cases (round 1), the tech plan fold-in (round 2a) and the design fold-in (round 2b), each on the coordinator's order. No writes to TestRail, Jira, Slack or Google; no commits.

## Counts

- **662 cases** in the library; **642 for TestRail** (section 136701); **20 kept out** (a tester cannot set them up: NO-MANUAL-PROPOSAL.md).
- Round 2a added 66 cases (S1-83, S1-84, S1-85, S1-86, S1-87, S1-88, S1-89, S1-90, S1-91, S2-98, S2-99, S2-100, S2-101, S2-102, S2-103, S2-104, S2-105, S2-106, S3-55, S3-56, S6-09, S6-10, S7-36, S7-37, S7-38, S8-28, S8-29, S8-30, S8-31, S9-45, S9-46, S10-15, S12-44, S12-45, S12-46, S12-47, S12-48, S12P-11, S12P-12, S12P-13, API-25, API-26, API-27, INV-15, INV-16, INV-17, INV-18, INV-19, INV-20, INV-21, INV-22, INV-23, INV-24, INV-25, INV-26, INV-27, INV-28, INV-29, INV-30, INV-31, INV-32, INV-33, INV-34, INV-35, REL-06, REL-07) and changed 46 existing cases (listed below, Rule 134).
- By story section: S1 94, S2 107, S3 56, S4 14, S5 14, S6 10, S7 38, S8 31, S9 46, S10 15, S12 48, S13 6, S12P 13, API 27, DATA 9, REL 7, INV 35, DESIGN 92.
- By TestRail folder (build.py FOLDER): Turn on Internal Work Orders, internal customers and categories 93, Waiting on the PO 11, Internal and no-charge work orders from creation to Close 101, Blocked on release 20, Close an internal or no-charge work order 56, Reopen a closed internal or no-charge work order 14, QuickBooks Online account mapping 14, AccountingHub account mapping 9, QuickBooks Online journal entries 37, AccountingHub records and entries 30, Reports, dashboard and exports 46, Shop supplies on internal and no-charge work orders 15, No-charge line on a billable work order 48, Starting categories and accounts 6, No-charge estimates and lines in the customer portal 12, API 7, Numbers across the documents, reports and books 8, Run on Production After Release 8, What must not change 35, Design — how it looks 92.
- Held: 65 — 12 × `waiting on the PO (question n)`; 5 × `a tester cannot set this up through the screens: the save has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: some conversions have to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: the save finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: the refusal is only reachable with a request sent outside the page`; 1 × `waits on the release of Maintenance Reminders`; 2 × `a tester cannot set this up through the screens: the change has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: the change finishes too fast to press twice; it needs a slowed connection a developer sets up`; 2 × `a tester cannot set this up through the screens: Close has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: Close finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: Reopen has to fail, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: Reopen finishes too fast to press twice; it needs a slowed connection a developer sets up`; 1 × `a tester cannot set this up through the screens: the same Close has to reach the sync twice, which only a developer can make happen`; 1 × `a tester cannot set this up through the screens: a replay of historical events is run by the AccountingHub team, not from the screens`; 1 × `a tester cannot set this up through the screens: the migration and the operator command are run by engineering, not from the screens`; 16 × `waits on the release of the Open API story SV-11833 (built after the Open API refactoring)`; 2 × `waits on invoice creation through the Open API being enabled (disabled today, enabled for general availability)`; 1 × `a tester cannot set this up through the screens: this is the app's own request, which needs a signed-in session token a tester does not handle`; 8 × `needs records and figures noted on production before the release reaches production; run on production after the release`; 6 × `the design differs from the PRD, waiting on the PO (question n)`.
- Runnable once a build exists (marker `Not available on Build to test Yet - Last checked 11/12/2026`, Rule 69): 597.

## Coverage per source (Rule 115)

| Source | Verdict | What |
|---|---|---|
| PRD v1.0 (Confluence 942243841) | ✓ | 205 of 205 requirement codes quoted word for word; 148 of 159 named items quoted (error handling, all 42 message rows, key decisions, permission rows and rules, terminology, overview, out of scope, goals, form factor), 11 not testable with the reason |
| Jira, epic SV-11665 (28 tickets) | ✓ | every story compared with its PRD story; 13 verify tasks mapped to their cases; 52 cases quote a ticket; ticket_sweep 0 unhandled |
| Tech plan rev. 5 (2026-11-10), via TECH-PLAN-TESTABLE.json (539 CONFIRM, 131 ADD, 10 DIVERGE) | ✓ | 108 of 131 ADD statements quoted by a case (new cases or result bullets), 23 left out with the reason (below); 46 CONFIRM statements quoted where they settle a detail the PRD leaves open; no DIVERGE statement is quoted (the PRD wins); 74 invariant rows mapped to cases (below) |
| Design "Internal Work Orders · All flows v6" (version 1794484794-2031), via the design worker's drive (design-2026-11-12/) | ✓ | 92 design cases in "Design — how it looks" (one per draft: 85 runnable look cases, 6 held design-version cases, 1 a tester cannot set up); References from Design on every design case and on 309 PRD cases whose screen a board draws (132 distinct pictures, all present in images/, attached by create.py); spec-to-design table {'DIFFERENT': 48, 'NOT SHOWN': 30, 'NO SCREEN': 117, 'SHOWN': 52}; register 55 differences: 48 settled by a named PRD sentence, 6 closed by a question on the sheet, 1 (IWO-D50) by a named ruling |

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

- **Design cases:** 92 (D-01 to D-92), made by `authoring/make_cases_design.py` from the design worker's drafts (`design-2026-11-12/tools/cases_data.py`, the data of DESIGN-CASE-PLAN.md); titles start "Design: "; every precondition list ends with the pictures to open beside the screen; every design case quotes the PRD sentence it checks and lists the boards, pictures and the design's own words under References from Design (checked word for word against the board files and the rendered text by build.py). Held design-version cases stay in "Design — how it looks".
- **Changes made to the drafts:** all READY markers -> the Rule 69 marker (no build yet); DV markers name the merged questions: DV-01 -> 12, DV-02 -> 3, DV-03 -> 13, DV-04 -> 14, DV-05 -> 15, DV-06 -> 16; quotes: (code, opening words) -> that requirement's whole sentence, verbatim; §8-NN -> UFS-NN; precondition 'Open the attached picture(s) ... at 100% zoom beside the screen.' added (as in the plan); '<number>' placeholders -> '[number]' with the square-bracket note; Rule 137: a 'Have a new / closed / invoiced ... work order' bullet ends ', made for this test.' (a record the case changes is fresh); notes: design question numbers -> merged numbers; case ids -> plain words; DC-44: the draft's 'turn the browser offline' step dropped and the case marked as one a tester cannot set up, the same ruling as the PRD case for a failed Close (round 1): a dropped network also stops the window loading, so the failure the PRD names cannot be made by hand; kept out of TestRail with the other cases a tester cannot set up; DC-50: hold 'AUTOMATION: HOLD - waiting on the PO (Total balance No Charge or $0.00)' lifted (settled in round 2a, question dropped).
- **PRD cases:** 309 carry References from Design: the case's primary PRD code (the screen it is about) is SHOWN or DIFFERENT on a board; boards come from the spec-to-design table's own board names, then the design cases that quote the same code (at most 4 pictures); a difference on any quoted code adds a note naming its register row and how it is closed. API cases and cases whose screen no board draws carry no heading.

| Register row (open) | Closed by |
|---|---|
| IWO-D09 | question 12 of PO-QUESTIONS-DRAFT.md (category-helper); held: D-87 |
| IWO-D19 | question 3 of PO-QUESTIONS-DRAFT.md (internal-estimate-stamp); held: S2-28, D-88 |
| IWO-D29 | question 13 of PO-QUESTIONS-DRAFT.md (locked-note); held: D-89 |
| IWO-D31 | question 14 of PO-QUESTIONS-DRAFT.md (reopen-message); held: D-90 |
| IWO-D44 | question 15 of PO-QUESTIONS-DRAFT.md (report-empty-cell); held: D-91 |
| IWO-D45 | question 16 of PO-QUESTIONS-DRAFT.md (report-wrapping); held: D-92 |
| IWO-D50 | named ruling, no question: two reviewer remarks left in the file of Review board 1.1, below its visible area; PRD Final v1.0 is newer than the design and its header says "Where a frame and this text disagree, the text wins"; it already gives the toggle description (S1-R1) and the No Charge badge in its own style (S2-R3), which is what the remarks ask; no verdict depends on them |

The other 48 rows are settled by the PRD sentence the register names; the cases follow the PRD and name the row in their References from Design.

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

## Story text (Jira) compared with PRD v1.0

Every story ticket says "Requirements, negative cases and edge cases live in the spec"; its one-paragraph summary was compared with the PRD story. Latest wins (Rule 32): PRD Final v1.0 of 9 Nov 2026. No story needs a PO question; the verify task SV-11976's "$0.00" is settled by the plan ("No Charge").

| Ticket | Verdict | Difference |
|---|---|---|
| SV-11665 | DIFFERS (older wording) | The epic summary names the setting "No-Charge Work Orders", a "No charge checkbox with a reason", a "No-Charge Work Orders report", and links PRD v0.16 and design v5.11. PRD v1.0 (latest, Final, 9 Nov 2026) names the setting and the report "Internal Work Orders", replaces Reason by Category (Terminology: "Reason → the earlier name ... Superseded by Category") and links design v6.1. Latest wins (Rule 32): cases follow PRD v1.0. Not asked: the PRD itself records the rename. |
| SV-11758 | DIFFERS (older wording) | Summary says "The No-Charge Work Orders setting"; PRD v1.0 S1-R1 names the toggle "Internal Work Orders". Everything else matches Story 1. Cases follow PRD v1.0. |
| SV-11759 | DIFFERS (older wording) | Summary says "the No charge checkbox with its Reason" and "Convert to no charge, Convert to billable and Change reason"; PRD v1.0 S2-R2, S2-R5, S2-R6: "No Charge" checkbox with Category, "Convert to No Charge", "Convert to Billable", "Change category" (Title Case). Cases follow PRD v1.0. |
| SV-11760 | SAME | Summary matches Story 3. |
| SV-11761 | SAME | Summary matches Story 4. |
| SV-11762 | DIFFERS (superseded design) | Summary says "Two rows ... Internal Work Orders Expense and No-Charge Work Orders Expense"; PRD v1.0 S5-R1: one row per category (Terminology: "Replaces the two fixed rows Internal Work Orders Expense and Customer No-Charge Expense of v0.17"). Cases follow PRD v1.0. |
| SV-11763 | DIFFERS (superseded design) | Summary says "Two mapping keys ... with seeded defaults"; PRD v1.0 S6-R1/S6-R2: one row per category with the starting mappings 6500, 6430, 6440. Cases follow PRD v1.0. |
| SV-11764 | SAME | Summary matches Story 7. |
| SV-11765 | SAME | Summary matches Story 8. |
| SV-11766 | DIFFERS (older wording) | Summary says "the new No-Charge Work Orders report with its Reason filter, and the invoice export option with the Classification and Reason columns"; PRD v1.0 S9-R2/S9-R6: "Internal Work Orders" report with a Category filter; export columns Classification and Category. Cases follow PRD v1.0. |
| SV-11767 | SAME | Summary matches Story 10. |
| SV-11833 | DIFFERS (older wording) | Summary says "a read-only classification and reason"; PRD v1.0 S11-R1: classification and category. Cases follow PRD v1.0. Both say Story 11 is built after the Open API refactoring: its cases open with a BLOCKED ON RELEASE line. |
| SV-12226 | SAME | Summary matches Story 12. |
| SV-12295 | DIFFERS (resolved since) | Summary says "Comeback Expense at the number the hub owner confirms"; PRD v1.0 S6-R2 and S13 prerequisites: 6440 Comeback Expense, confirmed 9 Nov 2026. Cases use 6440. |
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
| SV-12422 | S12P-* | Covers the portal. Its item 6 (a portal deposit refused after checkout is recorded with its own reason and can be refunded) has no PRD v1.0 sentence; the tech plan gives its message (TP-668) and the race behind it is asked: S12P-11, held on question 7. |

## Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| PRD `sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0) | 805 lines, 179,770 bytes | lines 1–805, 100% |
| Jira `sources/JIRA-SV-11665-tickets-2026-11-12.md` (epic, 14 stories, 13 verify tasks, fetched in full) | 454 lines | 1–454, 100% |
| Tech plan worker's outputs: TECH-PLAN-TESTABLE.json (680 statements and 8 context lines), TECH-PLAN-DIVERGENCES.md, INVARIANTS-FROM-PLAN.md, QUESTIONS-DRAFT.md, TECH-PLAN-READING-RECORD.md, NOTES.md | 259 KB + 45 KB | every statement and line, 100% |
| The tech plan itself (842 KB, 5,398 lines) | — | read in full by the tech plan worker (its reading record); this worker re-checks every quoted statement against its plan line by script |
| Design worker's outputs: tools/cases_data.py (every draft, DC-01 to DC-86 and DV-01 to DV-06, read in full), NEW-QUESTIONS.py (in full), DESIGN-DIVERGENCE-REGISTER.json (every row), SPEC-TO-DESIGN-2026-11-12.json (247 rows), DESIGN-FIGURES-2026-11-12.json (167 boards), tools/make_case_plan.py and tools/prd.py (in full) | — | 100%; DESIGN-CASE-PLAN.md is rendered from cases_data.py by make_case_plan.py, so its content was read through its data; build.py checks the case count equals the drafts |
| Rules and skills: LESSONS-REGISTER.md; Rule 4; Rules 96, 113–117 (all amendments), 122, 123, 129, 130, 132–140; IDEAL-TEST-CASE-STANDARD.md; skill 17 §0–2; skill 07 §2–6 | — | in full |

## Checks run

- `python3 authoring/build.py`: 0 PROBLEM lines; proposals.json (662 cases). New gates: every tech plan quote is word for word on its plan line, no DIVERGE statement is quoted, every ADD statement is quoted or listed as left out.
- `tester_readiness_check.py`: 0 hard problems. Round 1 read a sample of 6 and all 112 "does not / never" results; round 2a read a new sample of 6 (S1-88, S4-12, S2-28, S7-36, S12-35, S7-32) and every new "does not / never" result (13). Changes from the read: S12P-12 rewritten with a visible control and one action per step, an unneeded labor rate removed from S12-35.
- Round 2b: build.py adds the design gates (pictures exist, the design's words are on the case's boards, every open register row is closed by a sheet question or the named ruling, one case per design draft). Readiness: 0 hard; the sample read (D-72, S1-15, S5-05, S2-52, S3-33) and every "does not / never" result of the design cases (19) and of the rest (140 in all) read; each has its positive control in the same case.
- `ticket_sweep.py`: 0 unhandled tickets, PRD 1.0 handled. `create.py` dry run: nothing written.

## OUTSTANDING — what I need from you

- **Before any TestRail write (Rule 6):** create the subsections of section 136701 listed in sections.json and put their ids there; then `create.py --apply` (it attaches the design pictures and reads each case back).
- **NO-MANUAL:** confirm the 20 cases stay out of TestRail (recommended, as for Bill To).
- **For the QA lead only (Rule 30):** the plan-vs-PRD differences D-3 and D-5 to D-9 above need no PO answer; the cases follow the PRD.
- **Waiting on the PO (Rule 132):** PO-QUESTIONS-DRAFT.md, 16 questions for Milos, not yet sent (the sheet is built by the coordinator). Held on them: question 1: S1-02b; question 2: S2-32b; question 3: S2-28, D-88; question 4: S7-38; question 5: S2-106; question 6: S2-90; question 7: S12P-11; question 8: S8-26, S6-10; question 9: S2-100; question 10: API-23; question 11: DATA-09; question 12: D-87; question 13: D-89; question 14: D-90; question 15: D-91; question 16: D-92.
- **No QA branch is named:** every runnable case carries the Rule 69 marker until a build is checked.
