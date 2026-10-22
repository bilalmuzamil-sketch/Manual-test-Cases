# Jira reading record — epic SV-11315, read 22 Oct 2026 (read only)

Read with Atlassian getJiraIssue (description, comments, updated) on 22 Oct 2026. Every ticket under the epic was read in full:
the epic, the 9 stories, the 2 origin tickets, the 7 out-of-scope tickets and the 6 developer verify tasks (25 tickets; the
saved search `JIRA-EPIC-SV-11315-2026-10-22.json` lists the same 25). No ticket has a comment. Nothing was written to Jira.

## Stories (description + acceptance criteria) compared sentence by sentence with PRD v5

| Ticket | Updated | Differs from PRD v5? | The difference (the PRD wins; listed for the PO) |
|---|---|---|---|
| SV-11531 Story 1 | 2026-10-21 | YES | Jira S1-R8 reads "Paging (30 rows per page) never repeats or skips a customer, vendor or row, in any sort." PRD v5 S1-R8 states paging per report (30 customers or vendors per page on the Summaries, A/R Collection and A/P Unpaid Invoices; 100 lines per bucket then scroll on the Detail reports; change log 2026-10-20). AC 6 also says "more than 30 customers, vendors or rows". AC 1 gives the order "10 Trucking", "2 Trucking", "A-1 Towing", "a1 towing" (agrees with the PRD). |
| SV-11532 Story 2 | 2026-10-21 | no | Same requirement text. AC 6: "Given A/P Unpaid Invoices with a vendor credit, when Due Date or Past Due is sorted either way, then the credit sits at the bottom of its vendor group". AC 7 also lists the Past due filter among the changes that keep the sort; PRD S2-R7 lists "changing the as-of date, paging, and changing the customer, vendor or Location filter" (Past due not named). |
| SV-11533 Story 3 | 2026-10-21 | no | Same text. AC 3 example: one location ticked, 31-60 and 91+ ticked, two customers ticked → "Customers: <first>, <second>" in the order ticked. |
| SV-11534 Story 4 | 2026-10-21 | YES | Jira S4-R4 reads "On A/P Detail, expanding a bucket (by hand or with Expand all) shows its first 100 lines, then loads more as the user scrolls, as today." PRD v5 S4-R4 covers A/R Detail too ("new on A/R Detail, which today shows a whole bucket at once"); AC 2 also names A/P Detail only. |
| SV-11535 Story 5 | 2026-10-21 | YES (3) | (1) Jira S5-R3 ends "It is not narrowed by the Location filter or by the customer or vendor filter." PRD v5 adds "or the Past due filter; it changes only with the as-of date." (2) Jira S5-R7: "A row belongs to the location of its own document: an invoice, credit memo or deposit on A/R; a bill or vendor credit on A/P." PRD v5 states the A/P rule per document (bill: the delivery it was received on; vendor credit from a vendor return: that return's location; any other vendor credit: its vendor's location). (3) Jira S5-R19 keeps "An older link carrying a single Past due threshold (1, 31, 61 or 91) opens with every range at or above it ticked; for example 31 ticks 31-60, 61-90 and 91+ days." and AC 8 "an older link with pastDue=31 opens with 31-60, 61-90 and 91+ ticked". PRD v5 removed it (change log 2026-10-20: "no such link ever shipped"). |
| SV-11536 Story 6 | 2026-10-21 | no | Same text. |
| SV-11537 Story 7 | 2026-10-21 | adds one AC | Same requirement text. AC 6 "Given a row, when the user clicks anywhere but the link, then nothing opens." (PRD v5 What changes: "Clicking a row no longer opens it.") |
| SV-11538 Story 8 | 2026-10-21 | no | Same text (descriptions identical, curly apostrophes). AC 2 "text columns wrapping to a second line" is looser than S8-R3 (Location wraps only on A/P Detail). |
| SV-11539 Story 9 | 2026-10-21 | no | Same text. |

## Origin tickets

| Ticket | Status | Updated | Notes |
|---|---|---|---|
| SV-7192 | Blocked | 2026-10-15 | Fast Truck and Trailer (Intercom). Proposes a selectable option "Sort customers: Alphabetical (A-Z)" with a "Default order"; ties "e.g., secondary sort by Customer ID if available"; print/PDF follows the latest sort "without requiring page refresh". The PRD instead always opens A to Z with no option (S1-R1) and breaks name ties by the lower-cased name then the customer itself (S1-R4). The PRD wins. |
| SV-10798 | Blocked | 2026-10-15 | Cody (Intercom): "Would like the AP/AR reports to be defaulted to alphabetical order", "Should be able to sort the list by clicking on any of the column headers", "Would like the ability to export APAR reports". Covered by Stories 1, 2 and 3. |

## Out of scope (PRD "Other improvements")

| Ticket | Updated | Content (verbatim summary line) |
|---|---|---|
| SV-11441 (Bug) | 2026-10-16 | "A credit memo, deposit or vendor credit dated exactly on the as-of date is aged into 1-30 rather than Current (A/R and A/P code). Fixing it changes bucket numbers, so first check how QuickBooks buckets the same credit in a sandbox company, then decide." |
| SV-11442 | 2026-10-16 | "Let a user choose the aging period length (QuickBooks, Xero and Tekmetric offer it). Default must stay 30 days so today's numbers don't change." |
| SV-11443 | 2026-10-16 | "Per-customer \"Send statement\" from the A/R reports; the biggest request theme" |
| SV-11444 | 2026-10-16 | "Depends on the Splitting Sales Representatives rule (SV-10890) for which representative an invoice counts toward." |
| SV-11445 | 2026-10-20 | "Exports over the limits (CSV 50,000 rows, PDF 2,000 rows) are refused today. Run them in the background and notify the user when ready ... Over the limit the user sees \"We're preparing your export\", then gets an in-app notification with a download link" — a later phase, not this release. |
| SV-11446 | 2026-10-16 | "Weak demand; NetSuite shows both." (last payment date and credit limit columns) |
| SV-11447 | 2026-10-16 | "Notes per customer for collections follow-up" |

## Developer verify tasks (verbatim descriptions; used only as a supporting source where quoted)

### SV-11597 — A/R & A/P aging — verify Phase 1: shared report kit (updated 2026-10-21)
Verifies Phase 1 of the tech plan for SV-11315. Phase 1 changes shared pieces the other reports also use; there is no visible change to the aging reports yet.

Covers: S2-R4, S2-R6, S3-N1, S3-N2, S3-N3, S5-R10, S5-R15, S7-R5, S7-R7 (enabling pieces); NFR-002, NFR-003, NFR-004, NFR-005, NFR-008.

Check:
- Inventory Value, Sales By Customer and Work In Progress: filters, links shared from the address bar, and CSV/PDF exports behave exactly as before.
- A work order opened from a link at another location still asks to switch, and Cancel still returns to Work Orders with its message.
- The name-order check run against MySQL is attached to the PR and matches every PRD example (10 Trucking before 2 Trucking; Émile's with the E names; Øster before Ozone).
- The two new name indexes exist, and the schema check reports no differences.

All verification tickets Done → the feature is ready for QA.

### SV-11600 — A/R & A/P aging — verify Phase 1: shared report kit (updated 2026-10-21)
Word for word the same summary and description as SV-11597 (a duplicate ticket; noted for the QA lead, no action taken).

### SV-11595 — A/R & A/P aging — verify Phase 2: A/R Summary and A/P Summary (updated 2026-10-21)
Covers: S1-R1–R4, S1-R7, S1-R8, S1-N1, S1-E1, S2 (Summaries), S3 (Summary exports), S4-N2, S5-R1–R10, S5-R10a, S5-R12–R15, S5-R17–R19, S5-N1–N3, S5-E1, S5-E2, S6, S7 Summary-name links, S8; NFR-001, NFR-004, NFR-006, NFR-007.

Check (as admin, at 1440 px, light and dark):
- Both Summaries open A→Z, and the name column is marked sorted. Every header sorts: the first click on a money column is largest first, the second reverses, the third repeats the first.
- Scrolling page after page never repeats or skips a customer or vendor.
- Filter row order: As of, Customer/Vendor, Past due, Location. The Location menu lists every location with open documents, even for a user enrolled at one location. Choosing locations narrows rows and Totals. The Location column and "Multiple" follow the PRD. "No locations" shows the empty state and exports nothing.
- Past due: ticking 31-60 lists only accounts with an amount in that range, at their full balance. The chip reads "Past due: Any", one range, or "N ranges".
- Export: PDF and CSV match the screen's order and filters, and carry the As of / Locations / Past due / Customer(s) lines. PDF over 2,000 rows and CSV over 50,000 are refused with exactly one message. Empty → "Empty export".
- The customer name links only for users with Customers → View (check with a custom role); the vendor name links for everyone. Clicking a row no longer opens anything.
- Before merge: the staging-copy checks (query plan for the largest A/P shops; old vs new results for the 20 largest shops) and the G-DATA data check are recorded on the PR.

### SV-11596 — A/R & A/P aging — verify Phase 3: A/R Collection and A/P Unpaid Invoices (updated 2026-10-21)
Covers: S1-R6–R8, S2 (incl. S2-N1, S2-R5, S2-R6, S2-R9), S3 incl. S3-R8a, S4-R1–R3, S4-R5–R9, S4-N1, S5 incl. S5-R11 and S5-R16, S6, S7, S8, S9.

Check:
- Groups stay in name order while header clicks re-sort rows inside them. Re-sorting never collapses a group. Changing a filter collapses everything. Collapse all / Expand all sits in the top-left header cell, with its tooltip above.
- Expand all, then scroll: later groups also arrive expanded. The pinned group row pushes up as the next group arrives. The label stays visible when scrolling sideways.
- The Totals row follows the customer/vendor filter (today's bug is fixed).
- Links: an invoice at your current location opens its finance page. An invoice at another enrolled location asks to switch: Cancel leaves the address, filters, sort, expanded groups and scroll untouched; "Switch location" opens it. Non-enrolled or not-permitted → plain text. A bill at another location → plain text. A vendor credit from a return → links to the return. Opening in a new tab works.
- Call list: phone shown when present; credit term ("COD" when unset) only for users with 'View and Manage AP/AR Data', on screen, in the PDF and as a CSV column. Use a custom role to see it hidden.
- The Summary drill-down now carries the as-of date, Past due and locations.

### SV-11598 — A/R & A/P aging — verify Phase 4: A/R Detail and A/P Detail (updated 2026-10-21)
Covers: S1-R5, S1-R7, S1-R8, S2 (Detail), S3 (Detail exports), S4 incl. S4-R4, S5, S6, S7, S8 (Detail).

Check:
- Buckets always read 91+, 61-90, 31-60, 1-30, Current, whatever the sort. Rows inside open by name, then number-aware document number (S1-99 before S1-100).
- Expanding a bucket shows 100 lines, then more on scroll, on both reports (new on A/R Detail).
- On the QA organization (13,540 open A/P lines): first paint is quick, an A/P Detail PDF is refused with one message, and the CSV downloads.
- At 1440 px every column is visible; Location wraps only on A/P Detail.

### SV-11599 — A/R & A/P aging — verify Phase 5: legacy aging code retired (updated 2026-10-21)
Covers: retiring the old aging endpoints and their print path (A/R Print replaced by the Export menu), orphan filter components and the legacy Cypress aging specs.

Check:
- The E2E helpers and specs that used the old aging endpoints were moved before this merged (`/e2e-after-change`), and the nightly E2E run is green.
- The old aging routes no longer exist; the endpoint smoke test has no 500s.
- All six reports work end to end once more as admin.

## Epic SV-11315 (updated 2026-10-21, status Design In Progress)
Scope: "The six aging reports in Reports > Finance only." "Standalone project, separate from the app-wide Table sorting work (SV-11109)." "Includes PDF and CSV exports of all six reports, with size limits, and a Location filter. Background exports for very large reports come as a later phase of this epic (SV-11445)." The epic's Why says "Today the A/R report asks for A to Z but the order is not applied" (PRD Business Case: "the A/R reports come out in no set order").
