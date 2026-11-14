# Tiered Pricing — ticket sweep, epic SV-11692 (Rule 129)

Read 14 Nov 2026 with the Atlassian MCP tools. Read only: nothing was written to Jira.

| Check | Result |
|---|---|
| `parent = SV-11692` (every page) | 54 tickets, one page (`hasNextPage: false`) |
| `"Epic Link" = SV-11692` (every page) | the same 54 keys |
| Sub-tasks: `parent in (<all 54>)` | 0 |
| Issue links from the 54 | 207 link rows; 11 linked tickets outside the epic (none is a Bug/defect); the only defects in scope are the epic's own children SV-5744 and SV-7160 |
| Descriptions read | all 54 in full, plus comments (2 tickets have one each). Copies: `sources/jira/<key>.md` (SV-9314's customer contact block redacted for the public repo) |
| PRD versions | Tiered Pricing PRD page version 37 (in-body v0.17); companion PRD page version 21. Both equal the versions the two tech plans were built on, so no PRD diff is owed today |
| `ticket_sweep.py` | exits 1: 54 tickets PENDING and PRD not yet handled, as expected before any case exists (`TICKET-SWEEP.json` holds `prd_version_handled: 0`) |

Outcome column: **PENDING** until cases exist. *Planned* says what each ticket is expected to become.

## Stories (19 Tiered Pricing stories + the reports story SV-11718 + obsolete SV-11698) (21)

| Key | Type | Status | Summary | Story / scope | Planned outcome | Why |
|---|---|---|---|---|---|---|
| [SV-11693](https://shopview.atlassian.net/browse/SV-11693) | Story | Open | Tiered Pricing - Story 1 - Release day | TP Story 1 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11694](https://shopview.atlassian.net/browse/SV-11694) | Story | Open | Tiered Pricing - Story 2 - Tiers | TP Story 2 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11695](https://shopview.atlassian.net/browse/SV-11695) | Story | Open | Tiered Pricing - Story 3 - Matrices and rules | TP Story 3 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11696](https://shopview.atlassian.net/browse/SV-11696) | Story | Open | Tiered Pricing - Story 6 - Every matrix in one list | TP Story 6 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11697](https://shopview.atlassian.net/browse/SV-11697) | Story | Open | Tiered Pricing - Story 9 - Putting customers on tiers | TP Story 9 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11698](https://shopview.atlassian.net/browse/SV-11698) | Story | OBSOLETE | Tiered Pricing - Story 6 - Give a customer their own contract for a date range | TP Story 6 | NO-CASE | Obsolete: customer contracts out of scope (PRD Out of Scope); closed Won't Do 2026-11-09 by Matt Barge |
| [SV-11699](https://shopview.atlassian.net/browse/SV-11699) | Story | Open | Tiered Pricing - Story 10 - How a part is priced | TP Story 10 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11700](https://shopview.atlassian.net/browse/SV-11700) | Story | Open | Tiered Pricing - Story 11 - When a part is priced again | TP Story 11 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11701](https://shopview.atlassian.net/browse/SV-11701) | Story | Open | Tiered Pricing - Story 12 - Seeing what priced a part | TP Story 12 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11702](https://shopview.atlassian.net/browse/SV-11702) | Story | Open | Tiered Pricing - Story 13 - Part Sales | TP Story 13 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11703](https://shopview.atlassian.net/browse/SV-11703) | Story | Open | Tiered Pricing - Story 14 - Changing the customer on a work order | TP Story 14 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11704](https://shopview.atlassian.net/browse/SV-11704) | Story | Open | Tiered Pricing - Story 8 - Categories over time | TP Story 8 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11705](https://shopview.atlassian.net/browse/SV-11705) | Story | Open | Tiered Pricing - Story 16 - Who can do what | TP Story 16 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11706](https://shopview.atlassian.net/browse/SV-11706) | Story | Open | Tiered Pricing - Story 17 - Reports and totals stay consistent | TP Story 17 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11707](https://shopview.atlassian.net/browse/SV-11707) | Story | Open | Tiered Pricing - Story 18 - Accounting and QuickBooks receive the right figures | TP Story 18 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11708](https://shopview.atlassian.net/browse/SV-11708) | Story | Open | Tiered Pricing - Story 15 - The below-cost warning in the matrix | TP Story 15 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11709](https://shopview.atlassian.net/browse/SV-11709) | Story | Open | Tiered Pricing - Story 19 - Shared behavior for every new page, dialog and list | TP Story 19 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-11718](https://shopview.atlassian.net/browse/SV-11718) | Story | Open | Tiered Pricing - Sales by Tier and Sales by Category reports | Reports PRD 968687617 (Stories 1-5) | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-12456](https://shopview.atlassian.net/browse/SV-12456) | Story | Open | Tiered Pricing - Story 4 - The tier grid: every tier of a matrix, edited in place | TP Story 4 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-12457](https://shopview.atlassian.net/browse/SV-12457) | Story | Open | Tiered Pricing - Story 5 - Price Part Simulator | TP Story 5 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |
| [SV-12458](https://shopview.atlassian.net/browse/SV-12458) | Story | Open | Tiered Pricing - Story 7 - Categories: every category's pricing at a glance | TP Story 7 | NEW-CASES (planned) | Story: one or more cases per requirement row in REQUIREMENTS-MAP.md |

## Pre-existing tickets parented to the epic (4)

| Key | Type | Status | Summary | Story / scope | Planned outcome | Why |
|---|---|---|---|---|---|---|
| [SV-4387](https://shopview.atlassian.net/browse/SV-4387) | Task | Board Backlog | Fixed sell price vs. Matrix | TP Story 10/11 (S10-R1, S11-N2, S11-R6) | NEW-CASES (planned) | Fixed-price-wins behaviour the PRD fixes (S10-R1 order 2, S11-N2, S11-R6); cases in Stories 10/11; today's behaviour is a defect, so NOT an invariant |
| [SV-5744](https://shopview.atlassian.net/browse/SV-5744) | Bug | Open | Bug: "Fixed-price $0 parts incorrectly adopt matrix pricing after category change | TP Story 11 (S11-N2) | NEW-CASES (planned) | Fixed-price-wins behaviour the PRD fixes (S10-R1 order 2, S11-N2, S11-R6); cases in Stories 10/11; today's behaviour is a defect, so NOT an invariant |
| [SV-7160](https://shopview.atlassian.net/browse/SV-7160) | Bug | Open | Changing part category does not apply fixed pricing rule — sell price changes incorrectly with category selection | TP Story 11 (S11-N2) | NEW-CASES (planned) | Fixed-price-wins behaviour the PRD fixes (S10-R1 order 2, S11-N2, S11-R6); cases in Stories 10/11; today's behaviour is a defect, so NOT an invariant |
| [SV-9314](https://shopview.atlassian.net/browse/SV-9314) | Story | Open | Add floor-price (minimum margin) per pricing-matrix bracket to prevent price inversion | Out of scope (cost floor; S15 Out of Scope, S15-N5) | NO-CASE | Feature request for a cost/range floor; PRD Out of Scope ('Cost floor. A later release'); its opposite is tested as S15-N5 (no warning for an inversion) |

## Engineering verification tasks and the release-B task (29)

| Key | Type | Status | Summary | Story / scope | Planned outcome | Why |
|---|---|---|---|---|---|---|
| [SV-12665](https://shopview.atlassian.net/browse/SV-12665) | Task | Board Backlog | Verify: release-day migration, Default tier, General Matrix rename and the new permission atom (Phase 1) | TP Stories 1, 16 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12666](https://shopview.atlassian.net/browse/SV-12666) | Task | Board Backlog | Verify: tier-aware price resolver, exact rounding, fixed line totals and the invoice part-line snapshot (Phase 3) | TP Stories 10, 12, 13, 17, 18 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12667](https://shopview.atlassian.net/browse/SV-12667) | Task | Board Backlog | Verify: every add, edit, receive, split and Change Customer path prices by the work order's tier (Phase 4) | TP Stories 1, 10, 11, 13, 14 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12668](https://shopview.atlassian.net/browse/SV-12668) | Task | Board Backlog | Verify: lines record what priced them, and the API withholds it without See Financial Data (Phase 5) | TP Stories 10, 12 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12669](https://shopview.atlassian.net/browse/SV-12669) | Task | Board Backlog | Verify: Priced by column, price details, Manual icon, tier-aware add paths and the receive notice (Phase 6) | TP Stories 9, 10, 11, 12, 13, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12670](https://shopview.atlassian.net/browse/SV-12670) | Task | Board Backlog | Verify: Change Customer dialog pricing copy, amber tier note and lines-priced notice (Phase 7) | TP Stories 13, 14 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12671](https://shopview.atlassian.net/browse/SV-12671) | Task | Board Backlog | Verify: tiers and matrices API, including grid saves, Set Rule, Undo, tier delete and audit entries (Phase 8) | TP Stories 1, 2, 3, 4, 6, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12672](https://shopview.atlassian.net/browse/SV-12672) | Task | Board Backlog | Verify: categories API, category moves, category delete and category audit entries (Phase 9) | TP Stories 7, 8, 18, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12673](https://shopview.atlassian.net/browse/SV-12673) | Task | Board Backlog | Verify: customer tier API, Manage Customers bulk saves and the pricing Audit Log reads (Phase 10) | TP Stories 9, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12674](https://shopview.atlassian.net/browse/SV-12674) | Task | Board Backlog | Verify: Settings › Pricing tabs, the Parts menu order and the Matrices list (Phase 11) | TP Stories 3, 6, 7, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12675](https://shopview.atlassian.net/browse/SV-12675) | Task | Board Backlog | Verify: pricing engine, matrix page in view, Price Part Simulator and below-cost warning (Phases 2 and 12) | TP Stories 3, 4, 5, 10, 15, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12676](https://shopview.atlassian.net/browse/SV-12676) | Task | Board Backlog | Verify: grid editing, New Matrix, save questions, archived-view editing and the discard guard (Phase 13) | TP Stories 1, 3, 4, 7, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12677](https://shopview.atlassian.net/browse/SV-12677) | Task | Board Backlog | Verify: Tiers list, tier page, archive, delete, reactivate and Set Rule with Undo (Phase 14) | TP Stories 2, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12678](https://shopview.atlassian.net/browse/SV-12678) | Task | Board Backlog | Verify: a tier's Customers tab and Manage Customers add and remove (Phase 15) | TP Stories 2, 9, 16 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12679](https://shopview.atlassian.net/browse/SV-12679) | Task | Board Backlog | Verify: Categories list, category page, New Category, name rules and category delete (Phase 16) | TP Stories 7, 8, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12680](https://shopview.atlassian.net/browse/SV-12680) | Task | Board Backlog | Verify: customer tier fields in New and Edit Customer and the customer card's Pricing section (Phase 17) | TP Stories 9, 16, 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12681](https://shopview.atlassian.net/browse/SV-12681) | Task | Board Backlog | Verify: legacy matrix and category dialogs removed and old pricing routes gone (Phase 18) | TP Stories 19 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12682](https://shopview.atlassian.net/browse/SV-12682) | Task | Board Backlog | Drop `pricing_rule` and `pricing_matrix.categories` (step 2 of 2) | Engineering release B (NFR-009, D5, D14) | NO-CASE | Engineering step 2 (drop legacy table/column); not tester-visible; its 'still works' gates feed the invariant list (matrix delete/duplicate) |
| [SV-12745](https://shopview.atlassian.net/browse/SV-12745) | Task | Board Backlog | Verify: Sales by Customer speed baseline recorded and the report index in place (Phases 0–1) | Reports PRD (SV-11718): NFR only | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12746](https://shopview.atlassian.net/browse/SV-12746) | Task | Board Backlog | Verify: part-line backfill, tie-out audit and the signed-off list of invoices that don't add up (Phase 2) | Reports PRD (SV-11718): S1, S5 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12747](https://shopview.atlassian.net/browse/SV-12747) | Task | Board Backlog | Verify: shared filter chips gain opt-in All labels, plain-when-all, search focus and new messages (Phase 4) | Reports PRD (SV-11718): S3 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12748](https://shopview.atlassian.net/browse/SV-12748) | Task | Board Backlog | Verify: the numbers: row membership, credit rules and Totals tying to Sales by Customer to the cent (Phase 6) | Reports PRD (SV-11718): S1, S2, S3, S5 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12749](https://shopview.atlassian.net/browse/SV-12749) | Task | Board Backlog | Verify: Sales by Tier endpoints, filter validation, drill keys, permissions and paging (Phases 5 and 7) | Reports PRD (SV-11718): S1, S2, S3 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12750](https://shopview.atlassian.net/browse/SV-12750) | Task | Board Backlog | Verify: Sales by Category endpoints, its four levels and part-line credits by category (Phase 8) | Reports PRD (SV-11718): S1, S5 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12751](https://shopview.atlassian.net/browse/SV-12751) | Task | Board Backlog | Verify: report labels, minus signs, dates and the three-click sort (Phase 9) | Reports PRD (SV-11718): S1, S3, S4 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12752](https://shopview.atlassian.net/browse/SV-12752) | Task | Board Backlog | Verify: drilling rows to customers and documents, paging, document links and in-row errors (Phase 10) | Reports PRD (SV-11718): S1, S2, S5 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12753](https://shopview.atlassian.net/browse/SV-12753) | Task | Board Backlog | Verify: the report page: filters, page address, Totals, column chooser, empty and error states (Phases 3 and 11) | Reports PRD (SV-11718): S1, S2, S3, S5 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12754](https://shopview.atlassian.net/browse/SV-12754) | Task | Board Backlog | Verify: the four downloads, their caps, header lines and column headers (Phase 12) | Reports PRD (SV-11718): S1, S4 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |
| [SV-12755](https://shopview.atlassian.net/browse/SV-12755) | Task | Board Backlog | Verify: Reports › Parts entries, filters carried between the reports, access and the speed bar (Phase 13) | Reports PRD (SV-11718): S1, S3 | COVERED (planned) | Engineering verify checklist restating PRD ids; covered by the story cases it names; its tester-visible additions are tech-plan rows in REQUIREMENTS-MAP.md |

## Linked tickets outside the epic (11)

| Key | Type | Status | Summary | Linked from |
|---|---|---|---|---|
| [SV-11165](https://shopview.atlassian.net/browse/SV-11165) | Task | Board Backlog | A single source of truth for part sell price, removing the null sell-price errors | SV-11699 |
| [SV-2958](https://shopview.atlassian.net/browse/SV-2958) | Task | Board Backlog | Customer setting - default matrix for parts | SV-11697 |
| [SV-3398](https://shopview.atlassian.net/browse/SV-3398) | Task | Done | Amplify Fixed Sell Price | SV-4387 |
| [SV-3411](https://shopview.atlassian.net/browse/SV-3411) | Task | Done | BE: Fixed Sell Price of Part | SV-4387 |
| [SV-4027](https://shopview.atlassian.net/browse/SV-4027) | Task | Board Backlog | Customer-specific parts pricing matrices | SV-11697 |
| [SV-4409](https://shopview.atlassian.net/browse/SV-4409) | Task | Board Backlog | Matrix min and max values in the rules  | SV-11695 |
| [SV-4411](https://shopview.atlassian.net/browse/SV-4411) | Task | Board Backlog | disable deleting last rule from the matrix | SV-11695 |
| [SV-4621](https://shopview.atlassian.net/browse/SV-4621) | Task | Board Backlog | Add Optional Cost Field for Found Parts | SV-11700 |
| [SV-7857](https://shopview.atlassian.net/browse/SV-7857) | Story | Open | Add flat-rate/dollar-value parts markup option | SV-11695 |
| [SV-9414](https://shopview.atlassian.net/browse/SV-9414) | Story | Open | Add automated zero-markup pricing rule at the customer level for internal customers (remove need for manual per-invoice 'internal' flag) | SV-11699 |
| [SV-9492](https://shopview.atlassian.net/browse/SV-9492) | Story | Open | Add COST + pricing model to Price Matrix with tiered adders and optional correlation with margin pricing | SV-11695 |

## What the tickets add or contradict (details in `sources/notes/NOTES-PRD-AND-TICKETS-2026-11-14.md`)

| Ticket | Point | Disposition |
|---|---|---|
| SV-11707 (Story 18) | Acceptance criterion says revenue books to the part's **catalog** category (Brakes) when the line was moved to Tires; its own requirement line and PRD S18-R3 say **the category on the line** (PRD change log 11 Nov 2026: "QuickBooks books by the line's category") | Stale acceptance criterion. Cases follow PRD S18-R3 (latest dated decision, Rule 32). Not a PO question; tell the QA lead so the PO can correct the ticket |
| SV-11718 (reports) | Summary says Totals tie to Sales by Customer **and Sales**; its own S1-R7 and the reports PRD say they do **not** tie to Sales (change log 11 Nov 2026) | Stale summary; PRD wins; flag only |
| SV-12458 (Story 7) | Example "The Tread Plus matrix also prices 1 other category: Tires, Retread." lists the current category too | Typo in the ticket; the PRD S7-R15 pattern is used; flag only |
| SV-11694 (Story 2) | Acceptance criterion says "when Save is clicked" on New Tier; the PRD's button is Create Tier | Wording only; screen label comes from the PRD/design/build |
| 18 TP "Verify:" tasks | Say the plan is "built on PRD v0.17 (page version 35)"; the plan itself is at page version 37 | Stale ticket text; no behaviour impact |
| SV-12667 | "A reopened paid work order takes the customer's current tier." Not in the PRD (S10-R14 keeps the tier a work order was made with) | Tech-plan addition (D-decision); candidate PO question Q1 in PO-QUESTIONS-DRAFT.md |
| SV-12671 / SV-12677 | A tier kept only by an invoiced work order can be deleted; reversing that invoice then prices new parts at Default | Tech-plan addition (D33); rows TPX-* in REQUIREMENTS-MAP.md |
| SV-12675 | Categories picker on the matrix page "saves when it closes" vs PRD S3-R13 "moves it to this matrix when the matrix is saved" | Checked against the tech plan; see REQUIREMENTS-MAP.md and PO-QUESTIONS-DRAFT.md |

## 14 Nov 2026 (consolidation) — every ticket has its verdict

Re-swept the same day (`parent = SV-11692`, one page, 54 tickets, `sources/jira/JIRA-SWEEP-SV-11692-2026-11-14-resweep.json`): no ticket added, removed or
updated since the morning read. `TICKET-LEDGER.json` now gives every ticket an outcome: **20 NEW-CASES** (the 19 story tickets that carry cases and
SV-11718), **30 COVERED** (the 27 engineering "Verify" checklists, by the cases of the stories they restate, API halves listed for the
automation owner; SV-4387, SV-5744, SV-7160 by the fixed-price cases), **4 NO-CASE** (SV-11698 obsolete, SV-9314 out of scope, SV-12682 engineering
step, SV-12745 speed baseline), 0 ASKED; plus the 11 linked tickets (8 COVERED, 3 NO-CASE). `TICKET-SWEEP.json` `prd_version_handled` = 37.
`ticket_sweep.py` **exits 0** (0 unhandled tickets, PRD handled). The PRD page version itself was not re-read in this pass (Rule 59: re-read both
PRDs immediately before any TestRail write).
