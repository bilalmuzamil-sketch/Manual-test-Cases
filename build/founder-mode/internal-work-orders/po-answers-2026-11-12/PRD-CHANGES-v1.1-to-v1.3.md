# PRD changes v1.1 → v1.3 — Internal Work Orders (Confluence 942243841)

Read 12 Nov 2026 19:34 UTC. Old: `sources/CONFLUENCE-942243841-v1.1-read-2026-11-12.md` (807 lines). New: `sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md` (809 lines of page body after the read-record line; Status row shows v1.3 (2026-11-12) as the latest entry; last modified about 19:01 UTC, 12 Nov 2026, from Confluence's "33 minutes ago"). v1.2 and v1.3 were both published on 12 Nov 2026; only v1.3 could be read, so this compares v1.1 with v1.3 directly.

**Reading coverage:** the line diff `PRD-DIFF-v1.1-to-v1.3.txt` (66 lines: 32 removed, 34 added, 47,742 bytes) was read in full, line by line, plus a word-level diff of each changed line. Every other line of v1.3 is byte-identical to v1.1 (the heading outline of 24 headings is identical, and the page ends at the same "## 9. Change Log" paragraph). 100% of the changed lines read.

**Counting:** "Cases" counts keys in `authoring/proposals.json` whose codes carry the id or whose quoted PRD sentence is part of the old line (from `AFFECTED-CASES-v1.3.json`); "named only" counts keys that only mention the id in their text.

## Summary table

| # | Changed item | Plain change | Cases (coded or quoted) | Named only |
|---|---|---|---|---|
| 1 | Status row | Version history only: it adds the v1.2 and v1.3 entries, which name the changed requirements (S1-R3, S3-R1, S3-R2, S3-R3, S3-N4, S3-E1, S3-E2, S3-E4, S3-E5, S7-N5, S10-R3, Key Decisions, Terminology, section 8); no behaviour of its own, but every case's From line must now cite v1.3. | 0 | 0 |
| 2 | Design row | The PRD now points to the design as "All flows v6.2 (Claude Design canvas, Nov 12, 2026)" instead of v6.1 of Nov 5; the link is unchanged and the text still wins over a frame. | 0 | 0 |
| 3 | OV-CLOSE | Close Work Order now takes one press and opens no confirmation; the posting date, parts cost and its account, special orders and sublet, shop supplies and labor hours are shown on the Finance tab before the press instead of in a confirmation. | 2 | 0 |
| 4 | KD-ALWAYS | The one case where Close does not go through is now a no-charge work order whose category requires the original work order and has none (the dialog asks for it), instead of a work order that changed under an open confirmation. | 3 | 0 |
| 5 | KD-ONEPRESS | The decision is restated as no confirmation at all, like Create invoice today (SV-10312), with what will post readable on the Finance tab; "a confirmation that lists the postings" becomes a rejected option (decided 2026-11-12). | 1 | 0 |
| 6 | PM-11 | The cost that needs 'See Financial Data' is now in the Finance tab posting summary (no longer in a Close confirmation); without the permission cost is hidden and hours are shown, as before. | 2 | 0 |
| 7 | T-CLOSED | The Finance tab replaces the Close confirmation in the list of places that name a closed work order Closed · Internal / Closed · No Charge. | 2 | 0 |
| 8 | T-HOURS | The Finance tab posting summary replaces the Close confirmation as a place that shows the labor hours on the lines. | 3 | 0 |
| 9 | T-PDATE | Posting date is now a field on the Finance tab of an internal or no-charge work order (where a billable one has Invoice Date), default today, instead of a date in the Close confirmation. | 3 | 0 |
| 10 | Design line, Story 1 | The Story 1 design list now says frame 2 shows one hint line (was hint lines); nothing else in the list changed. | 0 | 0 |
| 11 | S1-R2 | After Save in the first turn-on modal the page shows the toggle on and one hint line (was "the hint lines"); the modal itself is unchanged. | 14 | 2 |
| 12 | S1-R3 | With the toggle on there is one hint line, not two: "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.", Internal Work Orders and QuickBooks are links, QuickBooks is named only when connected at any location, AccountingHub is named as Accounting > Account Mappings, both are named when both are used, and with neither the sentence ends at "set there."; the second line "Map their expense accounts in Integrations > QuickBooks." with the QuickBooks mark is gone. | 8 | 28 |
| 13 | S1-R4 | With the toggle on and no flagged customer, the "No internal customer yet. …" text replaces "the hint" (was "the first hint"), so it is now the only line shown. | 3 | 2 |
| 14 | S1-R10 | Turning the toggle off hides, and turning it on again brings back, the one hint line (was hint lines); the rest is unchanged. | 6 | 33 |
| 15 | S2-E7 | The core-cost wording "Stock parts $[amount], includes $[core amount] core cost · Posted to [account]" now appears in the Stock parts row of the Finance tab posting summary instead of a Close confirmation row. | 6 | 38 |
| 16 | Design line, Story 3 | The Story 3 design list now names frame 7 as the Finance tab with the posting date and summary (no confirmation), 7b as the no-account warning in the summary, 7e as the cost move dialog, Flow 2 frames 4 and 4b, and Review 5.1 / 5.2, all redrawn 2026-11-12 for v1.2 (v6.2); the still-to-draw list is unchanged. | 0 | 0 |
| 17 | S3-R1 | Every place that offers Close Work Order (header button or mobile icon, three-dots menu, Finance tab action, lines bulk bar, Simple Mode wizard) now closes the work order on the press with no confirmation, except the two dialogs of S3-R2. | 8 | 0 |
| 18 | S3-R2 | No confirmation in the common case; the Finance tab of an open internal or no-charge work order carries a "Posting date" field (in place of Invoice Date, default today), a preview of the NO CHARGE document and, for users with 'See Financial Data', a posting summary with the same rows as before and the one sentence "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." (Closed · No Charge on a no-charge one; the "This completes the work order …" variant and the "Posted to 6430 Warranty & Goodwill Expense" example sentence are gone); a dialog "Close work order [number]?" opens only (1) on a no-charge work order whose category requires the original work order and has none (Original work order * / Original line selects, the warning, Cancel / Close Work Order disabled until picked, never for Goodwill) or (2) when a vendor bill's cost moves to another account at Close at a location with an accounting integration (one "Moved from [account] to [account] $[amount]" row per pair of accounts, amounts added up, Cancel / Close Work Order), and one dialog carries both when both apply. | 19 | 69 |
| 19 | S3-R3 | Close Work Order itself (not "confirming") does the closing; when the work order is not yet Complete the completion run is tech stories, parts to pick, core decisions, parts to receive, then missing details, in that order, and its last "Close Work Order" button closes, opening a dialog only in the two cases of S3-R2. | 7 | 6 |
| 20 | S3-N4 | The "No account set for [category]. …" warning (with Set account / Account Mappings link) now sits in the Finance tab posting summary, and "Close Work Order is not blocked" replaces "The button still reads Close Work Order". | 7 | 19 |
| 21 | S3-E1 | With no parts the posting summary shows "Stock parts $0.00" (was "Parts cost $0.00" in the confirmation); posting and the internal invoice are unchanged. | 2 | 0 |
| 22 | S3-E2 | A part with no cost is listed under "Parts with no cost" in the posting summary (was in the confirmation); the rest still posts. | 2 | 0 |
| 23 | S3-E4 | With no accounting integration the posting summary shows its rows without account notes and the sentence "Closing marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report." (the "This …" wording and the not-yet-Complete variant are gone), and the cost move dialog never appears there. | 3 | 16 |
| 24 | S3-E5 | "This work order changed. Review and close again." now appears only if the work order changes while one of the two S3-R2 dialogs is open; without a dialog the press simply closes what is on the work order at that moment. | 4 | 2 |
| 25 | S7-R8 | Wording only for Create invoice on a billable work order with no-charge lines: its cost-move dialog is now described as "the same dialog Close shows for a move"; Create invoice behaviour is unchanged. | 11 | 1 |
| 26 | S7-N5 | The note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped." now shows on the Stock parts and Special orders rows of the Finance tab posting summary instead of a Close confirmation. | 2 | 12 |
| 27 | Design line, Story 10 | The Story 10 design list drops "7 (confirmation row)" and "Nothing left to draw." and says the Shop supplies row sits in the Finance tab posting summary (Flow 1 frame 7, v6.2). | 0 | 0 |
| 28 | S10-R3 | The "Shop supplies $[amount]" row with its "Posted to …, credited to …" note is now in the Finance tab posting summary instead of the Close confirmation. | 5 | 0 |
| 29 | S10-N1 | When the shop supplies amount is $0.00 no row shows in the posting summary (was the confirmation) and nothing posts. | 1 | 0 |
| 30 | §8 User Feedback Summary rows | v1.1 row 16 "Close confirmation" is removed and replaced by three rows (v1.3 rows 16 "Close with a required original work order missing", 17 "Close with a cost move", 18 "Finance tab posting summary"); v1.1 row 19 "Close without integration" (now row 21) reads "Closing marks …" under the posting summary; v1.1 row 29 (now row 31) is renamed "Work order changed under an open Close dialog". The table grows from 43 to 45 rows, so every v1.1 row 17–43 is now row 19–45. | UFS-16: 2, UFS-19: 1, UFS-29: 1 | 41 keys carry a UFS-17…43 code whose number shifts by 2 |

## Each change in full (old text, new text)

Texts are copied verbatim from the two saved page bodies (markdown escapes as Confluence returned them).

### Status row / Design row

**Old (v1.1 line 5, Status row):**

> | **Status** | Final v1.0 (2026-11-09): handed to engineering. v1.1 (2026-11-12): QA questions 1 to 16 answered in the text (two message table rows aligned, INTERNAL stamp on the internal estimate, Create invoice rows per account pair, the Closed filter value after first use, no work order import today, a portal deposit paid after Convert, the hub refuses to deactivate a mapped account, lines return billable after Convert to Billable, a dash for an empty cell and an undefined Comeback rate, report widths, category helper texts, the Reopen success message). Rounds 1 to 4 of engineering questions are answered in the text, the AccountingHub owner has confirmed the accounts (6430, 6440) and the held lifecycle (HQ8), and the design authority review of 2026-11-06 is addressed. Changes from here are logged as v1.x in this cell. Draft history: v0.24 (2026-11-09, HQ8 confirmed by the hub owner: lifecycle of the held vendor bill line move in S8-R3; v0.23 of 2026-11-09, engineering round 4 answered: Q62 to Q67, the vendor bill addition to Q30, HQ8 proposed to the hub owner; v0.22 of 2026-11-09, engineering round 3 answered: Q30 to Q61 and HQ1 to HQ7, Comeback Expense 6440 confirmed by the hub owner, hub setup as an operator command, portal facts; v0.21 of 2026-11-06, cleanup after the design authority review: superseded text removed, customer change after invoicing aligned to the code, the Open API outside the permission matrix, Story 13 Rollout, usage tracking note; v0.20 of 2026-11-05 evening, seams review: permissions, server-side enforcement, prices never written back at receive or on cores, warranty flag reuse, seeding, archived defaults, fixed lines, QuickBooks class and item, vendor bills per line, rule zero for reports, deposits, credits, returns). v0.19 the same day added categories, Story 12 and the original work order and line. Not yet reviewed by the design authority. Version notes are in the page history; the full change log is kept in the PM's working file. |

**Old (v1.1 line 6, Design row):**

> | **Design** | [Internal Work Orders, All flows v6.1 (Claude Design canvas, Nov 5, 2026)](https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo) (Milos Vasic). Where a frame and this text disagree, the text wins |

**New (v1.3 line 5 of the body, Status row):**

> | **Status** | Final v1.0 (2026-11-09): handed to engineering. v1.3 (2026-11-12): the Settings tab keeps one hint line (S1-R3); the Close frames of the design are redrawn for v1.2. v1.2 (2026-11-12): Close Work Order runs with no confirmation, like Create invoice (SV-10312); the posting date and the posting summary sit on the Finance tab; a dialog opens only for a missing original work order or a vendor bill cost move (S3-R1, S3-R2, S3-R3, S3-N4, S3-E1, S3-E2, S3-E4, S3-E5, S7-N5, S10-R3, Key Decisions, Terminology, section 8). v1.1 (2026-11-12): QA questions 1 to 16 answered in the text (two message table rows aligned, INTERNAL stamp on the internal estimate, Create invoice rows per account pair, the Closed filter value after first use, no work order import today, a portal deposit paid after Convert, the hub refuses to deactivate a mapped account, lines return billable after Convert to Billable, a dash for an empty cell and an undefined Comeback rate, report widths, category helper texts, the Reopen success message). Rounds 1 to 4 of engineering questions are answered in the text, the AccountingHub owner has confirmed the accounts (6430, 6440) and the held lifecycle (HQ8), and the design authority review of 2026-11-06 is addressed. Changes from here are logged as v1.x in this cell. Draft history: v0.24 (2026-11-09, HQ8 confirmed by the hub owner: lifecycle of the held vendor bill line move in S8-R3; v0.23 of 2026-11-09, engineering round 4 answered: Q62 to Q67, the vendor bill addition to Q30, HQ8 proposed to the hub owner; v0.22 of 2026-11-09, engineering round 3 answered: Q30 to Q61 and HQ1 to HQ7, Comeback Expense 6440 confirmed by the hub owner, hub setup as an operator command, portal facts; v0.21 of 2026-11-06, cleanup after the design authority review: superseded text removed, customer change after invoicing aligned to the code, the Open API outside the permission matrix, Story 13 Rollout, usage tracking note; v0.20 of 2026-11-05 evening, seams review: permissions, server-side enforcement, prices never written back at receive or on cores, warranty flag reuse, seeding, archived defaults, fixed lines, QuickBooks class and item, vendor bills per line, rule zero for reports, deposits, credits, returns). v0.19 the same day added categories, Story 12 and the original work order and line. Not yet reviewed by the design authority. Version notes are in the page history; the full change log is kept in the PM's working file. |

**New (v1.3 line 6 of the body, Design row):**

> | **Design** | [Internal Work Orders, All flows v6.2 (Claude Design canvas, Nov 12, 2026)](https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo) (Milos Vasic). Where a frame and this text disagree, the text wins |

**What changed (Status row):** Version history only: it adds the v1.2 and v1.3 entries, which name the changed requirements (S1-R3, S3-R1, S3-R2, S3-R3, S3-N4, S3-E1, S3-E2, S3-E4, S3-E5, S7-N5, S10-R3, Key Decisions, Terminology, section 8); no behaviour of its own, but every case's From line must now cite v1.3.

**What changed (Design row):** The PRD now points to the design as "All flows v6.2 (Claude Design canvas, Nov 12, 2026)" instead of v6.1 of Nov 5; the link is unchanged and the text still wins over a frame.

### OV-CLOSE

**Old (v1.1 line 36, OV-CLOSE):**

> **Both close the same way.** Where a billable work order shows Create invoice, these show Close Work Order. One confirmation shows the posting date, the parts cost and the account it posts to, special-order parts and sublet, the shop supplies amount, and the labor hours on the lines, which are not posted. Confirming closes the work order: Closed · Internal or Closed · No Charge. Nothing is owed, nothing goes to receivables, no payment is recorded, no email, portal notification or invoice webhook is sent (the work order status webhook of Story 11 is), no tax or fees are added. The closed work order keeps a downloadable document stamped NO CHARGE, with parts at cost, labor in hours and, on a no-charge work order, the category, as proof of repair for a warranty claim or an auditor. Reopen Work Order reverses exactly what was posted and returns the work order to Complete.

**New (v1.3 line 36 of the body, OV-CLOSE):**

> **Both close the same way.** Where a billable work order shows Create invoice, these show Close Work Order. Close Work Order takes one press and opens no confirmation, like Create invoice. Before it, the Finance tab shows the posting date, the parts cost and the account it posts to, special-order parts and sublet, the shop supplies amount, and the labor hours on the lines, which are not posted. The press closes the work order: Closed · Internal or Closed · No Charge. Nothing is owed, nothing goes to receivables, no payment is recorded, no email, portal notification or invoice webhook is sent (the work order status webhook of Story 11 is), no tax or fees are added. The closed work order keeps a downloadable document stamped NO CHARGE, with parts at cost, labor in hours and, on a no-charge work order, the category, as proof of repair for a warranty claim or an auditor. Reopen Work Order reverses exactly what was posted and returns the work order to Complete.

**What changed (OV-CLOSE):** Close Work Order now takes one press and opens no confirmation; the posting date, parts cost and its account, special orders and sublet, shop supplies and labor hours are shown on the Finance tab before the press instead of in a confirmation.

### KD-ALWAYS

**Old (v1.1 line 103, KD-ALWAYS):**

> - **Close always succeeds (the one refusal is a work order that changed under the open confirmation, S3-E5). A missing account never blocks the advisor: QuickBooks posts to the ShopView Review account as it does for every other unmapped account today; AccountingHub holds the event with a Retry.** Rationale: the advisor is not the accountant, and the QuickBooks sync already has one rule for a missing mapping (post to the auto-created ShopView Review expense account and let the accountant reclass) and one for an account later deleted or deactivated in QuickBooks (the entry fails and shows in QB Unexported); a second rule for the category rows would surprise the accountant, and accounting asked for one rule for all rows. The hub has no fallback account, so there the event is held where the accountant already works and resends when the mapping is saved. Rejected: blocking Close until the account is mapped; holding in QB Unexported with a resend on mapping save; dropping the entry silently. Basis: PM, 2026-10-22; accounting confirmed hold on 2026-10-21; the QuickBooks rule was checked in the code 2026-10-27 (the review fallback is live for every account row and is not gated by the QuickBooks fallbacks toggle) and is with the hub owner for confirmation, as accounting asked. Follows `f-qb-sync-nonblocking-replayable`, `d-follow-incumbent-convention` and `d-never-force-keep-escape-hatch`.

**New (v1.3 line 103 of the body, KD-ALWAYS):**

> - **Close always succeeds (the one refusal is a no-charge work order whose category requires the original work order and has none, which the dialog of S3-R2 asks for). A missing account never blocks the advisor: QuickBooks posts to the ShopView Review account as it does for every other unmapped account today; AccountingHub holds the event with a Retry.** Rationale: the advisor is not the accountant, and the QuickBooks sync already has one rule for a missing mapping (post to the auto-created ShopView Review expense account and let the accountant reclass) and one for an account later deleted or deactivated in QuickBooks (the entry fails and shows in QB Unexported); a second rule for the category rows would surprise the accountant, and accounting asked for one rule for all rows. The hub has no fallback account, so there the event is held where the accountant already works and resends when the mapping is saved. Rejected: blocking Close until the account is mapped; holding in QB Unexported with a resend on mapping save; dropping the entry silently. Basis: PM, 2026-10-22; accounting confirmed hold on 2026-10-21; the QuickBooks rule was checked in the code 2026-10-27 (the review fallback is live for every account row and is not gated by the QuickBooks fallbacks toggle) and is with the hub owner for confirmation, as accounting asked. Follows `f-qb-sync-nonblocking-replayable`, `d-follow-incumbent-convention` and `d-never-force-keep-escape-hatch`.

**What changed (KD-ALWAYS):** The one case where Close does not go through is now a no-charge work order whose category requires the original work order and has none (the dialog asks for it), instead of a work order that changed under an open confirmation.

### KD-ONEPRESS

**Old (v1.1 line 108, KD-ONEPRESS):**

> - **Closing posts immediately and takes one press, like Create invoice.** Rationale: immediate posting is right for the common case and keeps the books correct during the month; the header Create invoice completes and invoices in one press today, so Close does the same with one confirmation. Rejected: monthly batch posting; backdating to the cost date; a preview step before the confirmation. Basis: PM, 2026-10-13; one press 2026-10-22.

**New (v1.3 line 108 of the body, KD-ONEPRESS):**

> - **Closing posts immediately and takes one press, like Create invoice.** Rationale: immediate posting is right for the common case and keeps the books correct during the month; the header Create invoice completes and invoices in one press and with no confirmation today (SV-10312), so Close does the same; what the press will post is readable on the Finance tab before it. Rejected: monthly batch posting; backdating to the cost date; a preview step; a confirmation that lists the postings (the advisor knows the cost and the hours already, and the postings are on the document and in the books). Basis: PM, 2026-10-13; one press 2026-10-22; no confirmation 2026-11-12.

**What changed (KD-ONEPRESS):** The decision is restated as no confirmation at all, like Create invoice today (SV-10312), with what will post readable on the Finance tab; "a confirmation that lists the postings" becomes a rejected option (decided 2026-11-12).

### PM-11

**Old (v1.1 line 132, PM-11):**

> | Cost on lines, in the Close confirmation and on the document | 'See Financial Data' | Cost hidden, hours shown |

**New (v1.3 line 132 of the body, PM-11):**

> | Cost on lines, in the Finance tab posting summary and on the document | 'See Financial Data' | Cost hidden, hours shown |

**What changed (PM-11):** The cost that needs 'See Financial Data' is now in the Finance tab posting summary (no longer in a Close confirmation); without the permission cost is hidden and hours are shown, as before.

### T-CLOSED

**Old (v1.1 line 147, T-CLOSED):**

> - Closed · Internal / Closed · No Charge → how running text, the Close confirmation, the success alert and the Reopen dialog name a closed internal or no-charge work order. On screen the status reads Closed and the one badge next to it reads Internal or No Charge, so the classification shows once. Underneath it is a work order with an internal invoice in the Closed state; the locks of an invoiced work order apply.

**New (v1.3 line 147 of the body, T-CLOSED):**

> - Closed · Internal / Closed · No Charge → how running text, the Finance tab, the success alert and the Reopen dialog name a closed internal or no-charge work order. On screen the status reads Closed and the one badge next to it reads Internal or No Charge, so the classification shows once. Underneath it is a work order with an internal invoice in the Closed state; the locks of an invoiced work order apply.

**What changed (T-CLOSED):** The Finance tab replaces the Close confirmation in the list of places that name a closed work order Closed · Internal / Closed · No Charge.

### T-HOURS

**Old (v1.1 line 151, T-HOURS):**

> - Hours → the labor hours on the lines of the work order, as the document shows them. The Close confirmation, the NO CHARGE document and the Internal Work Orders report use them. Clocked hours per technician are in Technician Efficiency.

**New (v1.3 line 151 of the body, T-HOURS):**

> - Hours → the labor hours on the lines of the work order, as the document shows them. The Finance tab posting summary, the NO CHARGE document and the Internal Work Orders report use them. Clocked hours per technician are in Technician Efficiency.

**What changed (T-HOURS):** The Finance tab posting summary replaces the Close confirmation as a place that shows the labor hours on the lines.

### T-PDATE

**Old (v1.1 line 156, T-PDATE):**

> - Posting date → the date in the Close confirmation, default today; the date of the expense entry.

**New (v1.3 line 156 of the body, T-PDATE):**

> - Posting date → the date field on the Finance tab of an internal or no-charge work order (where a billable one has Invoice Date), default today; the date of the expense entry.

**What changed (T-PDATE):** Posting date is now a field on the Finance tab of an internal or no-charge work order (where a billable one has Invoice Date), default today, instead of a date in the Close confirmation.

### Design line, Story 1

**Old (v1.1 line 179, Design line, Story 1):**

> **Design:** All flows v6.1, Flow 0: frames 1 (toggle off), 1b (turn-on modal with the customer picker, first turn-on only), 2 (toggle on, hint lines), 3 (toggle on, no flagged customer), 4 (Customers list, real page, with the Internal badge), 5 (Edit Customer with the checkbox at the bottom; header badge), 6 (Edit Customer with the setting off, checkbox read-only, no badge in the header), 7 (Make internal dialog with the work order list and the row notes, S1-R11), 8 (Remove flag dialog, S1-R12), 9 (QuickBooks ShopView Accounts with one row per category), 10 (QuickBooks rows empty), 11 (Edit Customer, Min shop supplies without a percentage, Story 10), 12 (toggle turned off). Still to draw: the customers list mobile card; the Make internal dialog with more than 10 work orders and without 'Work Orders — Create & Edit'; the sequence of S1-R11 dialogs for several customers; S1-R12 without open internal work orders; the S1-R3 hint for AccountingHub, both and neither.

**New (v1.3 line 179 of the body, Design line, Story 1):**

> **Design:** All flows v6.1, Flow 0: frames 1 (toggle off), 1b (turn-on modal with the customer picker, first turn-on only), 2 (toggle on, one hint line), 3 (toggle on, no flagged customer), 4 (Customers list, real page, with the Internal badge), 5 (Edit Customer with the checkbox at the bottom; header badge), 6 (Edit Customer with the setting off, checkbox read-only, no badge in the header), 7 (Make internal dialog with the work order list and the row notes, S1-R11), 8 (Remove flag dialog, S1-R12), 9 (QuickBooks ShopView Accounts with one row per category), 10 (QuickBooks rows empty), 11 (Edit Customer, Min shop supplies without a percentage, Story 10), 12 (toggle turned off). Still to draw: the customers list mobile card; the Make internal dialog with more than 10 work orders and without 'Work Orders — Create & Edit'; the sequence of S1-R11 dialogs for several customers; S1-R12 without open internal work orders; the S1-R3 hint for AccountingHub, both and neither.

**What changed (Design line, Story 1):** The Story 1 design list now says frame 2 shows one hint line (was hint lines); nothing else in the list changed.

### S1-R2 / S1-R3 / S1-R4

**Old (v1.1 line 201, S1-R2):**

> - **S1-R2:** Switching the toggle from off to on for the first time in the organization opens the modal "Which customers are your own company?" with the body "Work orders for these customers are internal: no prices and no invoice; parts cost posts to the expense account of their category when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page.", a customer picker (the standard customer Select with search, several customers can be picked, each shown as a chip with a remove control; up to 50, with the hint "Pick up to 50 customers here. Flag more from Edit Customer."), the line "You can change this any time: Customers \> Edit Customer \> Internal customer." and the buttons "Do this later" and "Save". No customer is preselected. Save is disabled until at least one customer is picked. Save saves the toggle (on) and flags the picked customers in one step (only this toggle and the flags; other unsaved changes on the tab wait for Save settings; to back out, the user switches the toggle off and saves settings), closes the modal and then shows the dialog of S1-R11 for each picked customer with open billable work orders, one after another; the page shows the toggle on and the hint lines of S1-R3 with nothing left to save for this setting. Closing the modal with X acts as "Do this later" (S1-R5); Esc and a click outside do nothing, as in every dialog of the app. The modal is shown once per organization: switching the toggle on again later opens nothing (S1-R10). Switching it off opens nothing. The modal never lists who is flagged, and Settings \> Work Orders never lists customers.

**Old (v1.1 line 202, S1-R3):**

> - **S1-R3:** While the toggle is on, two hint lines sit under the description, each with an info icon: "Manage categories in Internal Work Orders (Administration \> Service). Their expense accounts are set on each category." where Internal Work Orders is a link to the categories page (S1-R13), and "Map their expense accounts in Integrations \> QuickBooks." with the QuickBooks mark, where QuickBooks is a link (shown only when QuickBooks is connected at any location; for AccountingHub the hint names Accounting \> Account Mappings; with both, the hint names both; with neither, the second line is omitted). The earlier hint about flagging the company is dropped; the flag is explained on Edit Customer.

**Old (v1.1 line 203, S1-R4):**

> - **S1-R4:** While the toggle is on and no customer carries the flag, the first hint of S1-R3 reads instead "No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer \> Internal customer. No Charge on customer work orders works now." The text is informational; nothing is required and nothing is blocked.

**New (v1.3 line 201 of the body, S1-R2):**

> - **S1-R2:** Switching the toggle from off to on for the first time in the organization opens the modal "Which customers are your own company?" with the body "Work orders for these customers are internal: no prices and no invoice; parts cost posts to the expense account of their category when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page.", a customer picker (the standard customer Select with search, several customers can be picked, each shown as a chip with a remove control; up to 50, with the hint "Pick up to 50 customers here. Flag more from Edit Customer."), the line "You can change this any time: Customers \> Edit Customer \> Internal customer." and the buttons "Do this later" and "Save". No customer is preselected. Save is disabled until at least one customer is picked. Save saves the toggle (on) and flags the picked customers in one step (only this toggle and the flags; other unsaved changes on the tab wait for Save settings; to back out, the user switches the toggle off and saves settings), closes the modal and then shows the dialog of S1-R11 for each picked customer with open billable work orders, one after another; the page shows the toggle on and the hint line of S1-R3 with nothing left to save for this setting. Closing the modal with X acts as "Do this later" (S1-R5); Esc and a click outside do nothing, as in every dialog of the app. The modal is shown once per organization: switching the toggle on again later opens nothing (S1-R10). Switching it off opens nothing. The modal never lists who is flagged, and Settings \> Work Orders never lists customers.

**New (v1.3 line 202 of the body, S1-R3):**

> - **S1-R3:** While the toggle is on, one hint line sits under the description, with an info icon: "Manage categories in Internal Work Orders (Administration \> Service). Their expense accounts are set there or in Integrations \> QuickBooks." where Internal Work Orders is a link to the categories page (S1-R13) and QuickBooks a link to Integrations \> QuickBooks (named only when QuickBooks is connected at any location; for AccountingHub the sentence names Accounting \> Account Mappings; with both, it names both; with neither, it ends at "set there."). There is no second line. The earlier hint about flagging the company is dropped; the flag is explained on Edit Customer.

**New (v1.3 line 203 of the body, S1-R4):**

> - **S1-R4:** While the toggle is on and no customer carries the flag, the hint of S1-R3 reads instead "No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer \> Internal customer. No Charge on customer work orders works now." The text is informational; nothing is required and nothing is blocked.

**What changed (S1-R2):** After Save in the first turn-on modal the page shows the toggle on and one hint line (was "the hint lines"); the modal itself is unchanged.

**What changed (S1-R3):** With the toggle on there is one hint line, not two: "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.", Internal Work Orders and QuickBooks are links, QuickBooks is named only when connected at any location, AccountingHub is named as Accounting > Account Mappings, both are named when both are used, and with neither the sentence ends at "set there."; the second line "Map their expense accounts in Integrations > QuickBooks." with the QuickBooks mark is gone.

**What changed (S1-R4):** With the toggle on and no flagged customer, the "No internal customer yet. …" text replaces "the hint" (was "the first hint"), so it is now the only line shown.

### S1-R10

**Old (v1.1 line 209, S1-R10):**

> - **S1-R10:** Turning the toggle off hides the hint lines and the customer badges and leaves the flags on the customers. Open internal work orders are not touched: they keep their badge and close as internal. New work orders for a flagged customer are billable while the toggle is off. Turning it on again (with Save settings, like any other toggle) opens no modal: the customer badges and the hint lines come back and, on Save settings, for every flagged customer with open billable work orders, the dialog of S1-R11 is shown, one after another. New internal customers are flagged on Edit Customer (S1-R7).

**New (v1.3 line 209 of the body, S1-R10):**

> - **S1-R10:** Turning the toggle off hides the hint line and the customer badges and leaves the flags on the customers. Open internal work orders are not touched: they keep their badge and close as internal. New work orders for a flagged customer are billable while the toggle is off. Turning it on again (with Save settings, like any other toggle) opens no modal: the customer badges and the hint line come back and, on Save settings, for every flagged customer with open billable work orders, the dialog of S1-R11 is shown, one after another. New internal customers are flagged on Edit Customer (S1-R7).

**What changed (S1-R10):** Turning the toggle off hides, and turning it on again brings back, the one hint line (was hint lines); the rest is unchanged.

### S2-E7

**Old (v1.1 line 295, S2-E7):**

> - **S2-E7:** Parts with a core charge work as today up to resolution: the core row shows on the lines with no price, Core OK / Not OK is required before Close as it is before invoicing, and the completion wizard shows no core amount on an internal or no-charge work order. Not OK adds a charge to nobody; the vendor's core charge on the bill is cost and posts with the bill line (S7-R3). OK creates the vendor return as today, and its credit posts as in S7-R3a. Core cost is never part of Parts cost on the document or in the report. A stock part picked with its core posts both costs at Close, so the Close confirmation row says what posts: "Stock parts $\[amount\], includes $\[core amount\] core cost · Posted to \[account\]"; the document and the report keep Parts cost without cores.

**New (v1.3 line 295 of the body, S2-E7):**

> - **S2-E7:** Parts with a core charge work as today up to resolution: the core row shows on the lines with no price, Core OK / Not OK is required before Close as it is before invoicing, and the completion wizard shows no core amount on an internal or no-charge work order. Not OK adds a charge to nobody; the vendor's core charge on the bill is cost and posts with the bill line (S7-R3). OK creates the vendor return as today, and its credit posts as in S7-R3a. Core cost is never part of Parts cost on the document or in the report. A stock part picked with its core posts both costs at Close, so the Stock parts row of the Finance tab posting summary (S3-R2) says what posts: "Stock parts $\[amount\], includes $\[core amount\] core cost · Posted to \[account\]"; the document and the report keep Parts cost without cores.

**What changed (S2-E7):** The core-cost wording "Stock parts $[amount], includes $[core amount] core cost · Posted to [account]" now appears in the Stock parts row of the Finance tab posting summary instead of a Close confirmation row.

### Design line, Story 3

**Old (v1.1 line 307, Design line, Story 3):**

> **Design:** All flows v6.1, Flow 1: frames 3d (Close Work Order on the Finance tab), 4b (Mark Reviewed), 5 (Close Work Order button), 6 (Missing Details step before Close), 7 (confirmation with posting date and rows), 7b (ShopView Review variant), 7c (no integration), 7d (parts with no cost), 7e (S3-E5 inline error), 7f (QuickBooks without inventory accounts, S7-N5), 8 (closed, document), 10b (asset Invoices tab), S2 (failed); Flow 2: frames 4 (confirmation, no $0.00 shop supplies row), 5 (closed Finance tab with the category line). Still to draw: the mobile Close Work Order icon; the "Moved from" and "when the vendor bill is entered" notes and the multi-state row; the AccountingHub and no-charge variants of S3-N4 and the note without the Set account link; the both-integrations notes; the Email dialog.

**New (v1.3 line 307 of the body, Design line, Story 3):**

> **Design:** All flows v6.1, Flow 1: frames 3d (Close Work Order on the Finance tab), 4b (Mark Reviewed), 5 (Close Work Order button), 6 (Missing Details step before Close), 7 (Finance tab with the posting date and the posting summary, no confirmation), 7b (no account set, warning in the summary), 7c (no integration), 7d (parts with no cost), 7e (the cost move dialog), 7f (QuickBooks without inventory accounts, S7-N5), 8 (closed, document), 10b (asset Invoices tab), S2 (failed); Flow 2: frames 4 (Finance tab of the no-charge work order with the summary), 4b (the original work order dialog), 5 (closed Finance tab with the category line); Review 5.1 (the original work order dialog) and 5.2 (Finance tab with the summary). Redrawn 2026-11-12 for v1.2 (All flows v6.2). Still to draw: the mobile Close Work Order icon; the "Moved from" and "when the vendor bill is entered" notes and the multi-state row; the AccountingHub and no-charge variants of S3-N4 and the note without the Set account link; the both-integrations notes; the Email dialog.

**What changed (Design line, Story 3):** The Story 3 design list now names frame 7 as the Finance tab with the posting date and summary (no confirmation), 7b as the no-account warning in the summary, 7e as the cost move dialog, Flow 2 frames 4 and 4b, and Review 5.1 / 5.2, all redrawn 2026-11-12 for v1.2 (v6.2); the still-to-draw list is unchanged.

### S3-R1 / S3-R2 / S3-R3

**Old (v1.1 line 320, S3-R1):**

> - **S3-R1:** On an internal or no-charge work order, every place that offers "Create invoice" on a billable work order offers "Close Work Order" instead (Title Case, like Create Work Order, the same label everywhere) and opens the confirmation of S3-R2: the header button (on mobile, the icon button with the tooltip "Close Work Order"), the three-dots menu (only while it would hold Create invoice, S3-N2), the Create invoice action on the Finance tab, the finish action of the lines bulk bar, and the completion wizard of Simple Mode wherever it offers Create invoice (on these work orders the wizard shows no core amount and no "to invoice" wording). No path on these work orders creates a billable invoice. "Mark Reviewed" is unchanged.

**Old (v1.1 line 321, S3-R2):**

> - **S3-R2:** Close opens the confirmation "Close work order \[number\]?" with a posting date field (default today; it follows the rules of Invoice Date on the Finance-tab Create invoice today, and it is the date of the internal invoice, of every entry, and of the record in every report, export and the asset Invoices tab) and these rows: "Stock parts $\[stock parts cost\]" with the note "Posted to \[mapped account name\]" (the amount reads "$\[amount\], includes $\[core amount\] core cost" when a picked part carries a core, S2-E7); "Special orders and sublet $\[amount\]", one line per state present: already posted to the work order's account (note "Already posted to \[account\] at the vendor bill"), posted elsewhere and reclassed at Close (note "Moved from \[account\] to \[account\]"), and not yet billed (note "Posts to \[account\] when the vendor bill is entered"); the amount is the vendor bill line amount for billed items and the line cost for items not yet billed; the row is hidden when there are none; "Labor \[hours\] h" with the note "Hours only, nothing posted"; "Shop supplies $\[amount\]" with the note "Posted to \[work order's expense account\], credited to \[shop supplies account\]" (row hidden when the amount is $0.00). The document and the report show one Parts cost: stock parts plus special orders (S3-R5). Under the rows: "This posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." when the work order is already Complete, or "This completes the work order, posts the parts cost and shop supplies to your books and marks it Closed · Internal. You can reopen it later." when it is not (Closed · No Charge on a no-charge work order). Buttons: Cancel and "Close Work Order". Parts cost is the cost on each line at Close, as invoicing posts to Cost of Parts today; the hours are the labor hours on the lines. With both QuickBooks and AccountingHub, each note names the QuickBooks account and the AccountingHub account. When the category requires the original work order and none was picked, the confirmation shows the select "Original work order \*" (and "Original line") above the rows with the warning "\[Category\] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView."; Close Work Order stays disabled until one is picked; Goodwill never shows this. The Stock parts note names the category's account ("Posted to 6430 Warranty & Goodwill Expense").

**Old (v1.1 line 322, S3-R3):**

> - **S3-R3:** Confirming completes the work order if it is not yet Complete, creates the internal invoice underneath (carrying the work order number, nothing owed), relabels the picks to the internal invoice and sends their journal entries as invoicing does today (parts leave stock when they are picked), posts the entries of Stories 7 and 8, and shows the alert "Work order \[number\] is Closed · Internal." (or "Closed · No Charge."), with the X every alert in the app has. The work order shows the status Closed with its one badge (Internal or No Charge) and is locked as an invoiced work order is; underneath, the internal invoice is in the Closed state (Key Decisions). Every other effect of invoice creation applies: the snapshot in the work order history, the search index, the audit log; the exceptions are the ones listed in S3-R4 and the Customer PO rule of S3-R5. Adding a line to a closed work order spawns a new work order, as it does on an invoiced one today; the new one takes its customer's classification (S2-R1) and is billable on a regular customer. When the work order is not yet Complete, Close first runs the same completion steps as Create invoice today (tech stories, cores, and the missing details such as VIN, mileage and engine hours, per the organization's settings); the last button of that run reads "Close Work Order" and opens the confirmation of S3-R2.

**New (v1.3 line 320 of the body, S3-R1):**

> - **S3-R1:** On an internal or no-charge work order, every place that offers "Create invoice" on a billable work order offers "Close Work Order" instead (Title Case, like Create Work Order, the same label everywhere) and closes it on that press, with no confirmation (as Create invoice runs today, SV-10312) apart from the two dialogs of S3-R2: the header button (on mobile, the icon button with the tooltip "Close Work Order"), the three-dots menu (only while it would hold Create invoice, S3-N2), the Create invoice action on the Finance tab, the finish action of the lines bulk bar, and the completion wizard of Simple Mode wherever it offers Create invoice (on these work orders the wizard shows no core amount and no "to invoice" wording). No path on these work orders creates a billable invoice. "Mark Reviewed" is unchanged.

**New (v1.3 line 321 of the body, S3-R2):**

> - **S3-R2:** Close asks nothing in the common case. The Finance tab of an open internal or no-charge work order carries, where a billable work order has the Invoice Date field and the invoice preview, the field "Posting date" (default today; it follows the rules of Invoice Date today, and it is the date of the internal invoice, of every entry, and of the record in every report, export and the asset Invoices tab), the preview of the NO CHARGE document (S3-R5) and, for users with 'See Financial Data', a posting summary with these rows: "Stock parts $\[stock parts cost\]" with the note "Posted to \[mapped account name\]" (the amount reads "$\[amount\], includes $\[core amount\] core cost" when a picked part carries a core, S2-E7); "Special orders and sublet $\[amount\]", one line per state present: already posted to the work order's account (note "Already posted to \[account\] at the vendor bill"), posted elsewhere and reclassed at Close (note "Moved from \[account\] to \[account\]"), and not yet billed (note "Posts to \[account\] when the vendor bill is entered"); the amount is the vendor bill line amount for billed items and the line cost for items not yet billed; the row is hidden when there are none; "Labor \[hours\] h" with the note "Hours only, nothing posted"; "Shop supplies $\[amount\]" with the note "Posted to \[work order's expense account\], credited to \[shop supplies account\]" (row hidden when the amount is $0.00); under the rows, "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." (Closed · No Charge on a no-charge work order). The document and the report show one Parts cost: stock parts plus special orders (S3-R5). Parts cost is the cost on each line at Close, as invoicing posts to Cost of Parts today; the hours are the labor hours on the lines. With both QuickBooks and AccountingHub, each note names the QuickBooks account and the AccountingHub account. The summary is information, never a step: Close Work Order from the header, the menu, the bulk bar or the wizard closes without opening anything. Two cases open a dialog before closing, each only when its case applies: (1) a no-charge work order whose category requires the original work order and has none: "Close work order \[number\]?" with the selects "Original work order \*" and "Original line" of S2-R2, the warning "\[Category\] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.", and the buttons Cancel and "Close Work Order", disabled until one is picked; Goodwill never shows this; (2) a vendor bill whose cost moves to another account at Close (S7-R4), at a location with an accounting integration: "Close work order \[number\]?" with one "Moved from \[account\] to \[account\] $\[amount\]" row per pair of accounts, the amounts added up, and the buttons Cancel and "Close Work Order", the same dialog Create invoice shows for a move (S7-R8). When both apply, one dialog carries the selects above the rows.

**New (v1.3 line 322 of the body, S3-R3):**

> - **S3-R3:** Close Work Order completes the work order if it is not yet Complete, creates the internal invoice underneath (carrying the work order number, nothing owed), relabels the picks to the internal invoice and sends their journal entries as invoicing does today (parts leave stock when they are picked), posts the entries of Stories 7 and 8, and shows the alert "Work order \[number\] is Closed · Internal." (or "Closed · No Charge."), with the X every alert in the app has. The work order shows the status Closed with its one badge (Internal or No Charge) and is locked as an invoiced work order is; underneath, the internal invoice is in the Closed state (Key Decisions). Every other effect of invoice creation applies: the snapshot in the work order history, the search index, the audit log; the exceptions are the ones listed in S3-R4 and the Customer PO rule of S3-R5. Adding a line to a closed work order spawns a new work order, as it does on an invoiced one today; the new one takes its customer's classification (S2-R1) and is billable on a regular customer. When the work order is not yet Complete, Close first runs the same completion steps as Create invoice today (tech stories, parts to pick, core decisions, parts to receive, and the missing details such as VIN, mileage and engine hours, per the organization's settings, in that order); the last button of that run reads "Close Work Order" and closes; the dialogs of S3-R2 open from it only in their two cases.

**What changed (S3-R1):** Every place that offers Close Work Order (header button or mobile icon, three-dots menu, Finance tab action, lines bulk bar, Simple Mode wizard) now closes the work order on the press with no confirmation, except the two dialogs of S3-R2.

**What changed (S3-R2):** No confirmation in the common case; the Finance tab of an open internal or no-charge work order carries a "Posting date" field (in place of Invoice Date, default today), a preview of the NO CHARGE document and, for users with 'See Financial Data', a posting summary with the same rows as before and the one sentence "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." (Closed · No Charge on a no-charge one; the "This completes the work order …" variant and the "Posted to 6430 Warranty & Goodwill Expense" example sentence are gone); a dialog "Close work order [number]?" opens only (1) on a no-charge work order whose category requires the original work order and has none (Original work order * / Original line selects, the warning, Cancel / Close Work Order disabled until picked, never for Goodwill) or (2) when a vendor bill's cost moves to another account at Close at a location with an accounting integration (one "Moved from [account] to [account] $[amount]" row per pair of accounts, amounts added up, Cancel / Close Work Order), and one dialog carries both when both apply.

**What changed (S3-R3):** Close Work Order itself (not "confirming") does the closing; when the work order is not yet Complete the completion run is tech stories, parts to pick, core decisions, parts to receive, then missing details, in that order, and its last "Close Work Order" button closes, opening a dialog only in the two cases of S3-R2.

### S3-N4

**Old (v1.1 line 333, S3-N4):**

> - **S3-N4:** If no account is mapped for the work order's classification (for a no-charge work order in QuickBooks, no account for the work order's category), the confirmation of S3-R2 replaces the account note with: QuickBooks, "No account set for \[category\]. The entry posts to the ShopView Review account until you set one." with a "Set account" link to Integrations \> QuickBooks; AccountingHub, "No account set for \[category\]. The entry is held in Accounting Events until you set one." with a link to Account Mappings. The link is shown only to users with 'Settings — Integrations' (QuickBooks) or 'Accounting — Settings' (AccountingHub); others see the note without the link. The Shop supplies row follows the same rule when the Shop supplies item is not mapped (S10-N2). The button still reads "Close Work Order" and closes as in S3-R3. At a QuickBooks location without Inventory Asset or Cost of Parts, the parts rows carry the note of S7-N5 instead.

**New (v1.3 line 333 of the body, S3-N4):**

> - **S3-N4:** If no account is mapped for the work order's classification (for a no-charge work order in QuickBooks, no account for the work order's category), the posting summary of S3-R2 replaces the account note with: QuickBooks, "No account set for \[category\]. The entry posts to the ShopView Review account until you set one." with a "Set account" link to Integrations \> QuickBooks; AccountingHub, "No account set for \[category\]. The entry is held in Accounting Events until you set one." with a link to Account Mappings. The link is shown only to users with 'Settings — Integrations' (QuickBooks) or 'Accounting — Settings' (AccountingHub); others see the note without the link. The Shop supplies row follows the same rule when the Shop supplies item is not mapped (S10-N2). Close Work Order is not blocked and closes as in S3-R3. At a QuickBooks location without Inventory Asset or Cost of Parts, the parts rows carry the note of S7-N5 instead.

**What changed (S3-N4):** The "No account set for [category]. …" warning (with Set account / Account Mappings link) now sits in the Finance tab posting summary, and "Close Work Order is not blocked" replaces "The button still reads Close Work Order".

### S3-E1 / S3-E2

**Old (v1.1 line 338, S3-E1):**

> - **S3-E1:** If the work order has no parts, the confirmation shows "Parts cost $0.00"; Close posts no parts entry, posts the shop supplies entry when the amount is above $0.00 (S10-E2), and still creates the internal invoice.

**Old (v1.1 line 339, S3-E2):**

> - **S3-E2:** If a part on the work order has no cost recorded, the confirmation lists it under "Parts with no cost" and posts the rest; the hub and QuickBooks entries carry the costed parts only.

**New (v1.3 line 338 of the body, S3-E1):**

> - **S3-E1:** If the work order has no parts, the posting summary shows "Stock parts $0.00"; Close posts no parts entry, posts the shop supplies entry when the amount is above $0.00 (S10-E2), and still creates the internal invoice.

**New (v1.3 line 339 of the body, S3-E2):**

> - **S3-E2:** If a part on the work order has no cost recorded, the posting summary lists it under "Parts with no cost" and posts the rest; the hub and QuickBooks entries carry the costed parts only.

**What changed (S3-E1):** With no parts the posting summary shows "Stock parts $0.00" (was "Parts cost $0.00" in the confirmation); posting and the internal invoice are unchanged.

**What changed (S3-E2):** A part with no cost is listed under "Parts with no cost" in the posting summary (was in the confirmation); the rest still posts.

### S3-E4 / S3-E5

**Old (v1.1 line 341, S3-E4):**

> - **S3-E4:** If the shop has no accounting integration at the work order's location, Close shows the confirmation without account notes, and the sentence of S3-R2 is replaced by "This marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report." (with "This completes the work order and marks it ..." when it is not yet Complete)

**Old (v1.1 line 342, S3-E5):**

> - **S3-E5:** If lines, the shop supplies amount or the classification change after the confirmation opens, Close is refused with "This work order changed. Review and close again."

**New (v1.3 line 341 of the body, S3-E4):**

> - **S3-E4:** If the shop has no accounting integration at the work order's location, the posting summary shows its rows without account notes, and its sentence reads "Closing marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report."; the cost move dialog of S3-R2 is never shown there.

**New (v1.3 line 342 of the body, S3-E5):**

> - **S3-E5:** If lines, the shop supplies amount or the classification change while one of the dialogs of S3-R2 is open, Close is refused with "This work order changed. Review and close again."; without a dialog there is nothing to refuse, the press closes what is on the work order at that moment, as Create invoice does.

**What changed (S3-E4):** With no accounting integration the posting summary shows its rows without account notes and the sentence "Closing marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report." (the "This …" wording and the not-yet-Complete variant are gone), and the cost move dialog never appears there.

**What changed (S3-E5):** "This work order changed. Review and close again." now appears only if the work order changes while one of the two S3-R2 dialogs is open; without a dialog the press simply closes what is on the work order at that moment.

### S7-R8

**Old (v1.1 line 490, S7-R8):**

> - **S7-R8:** On a billable work order with no-charge lines (Story 12), the invoice is sent to QuickBooks as today with those lines at $0.00. For each no-charge line, the inventory journal entries of its picked stock parts debit the line's category account instead of Cost of Parts, with the same credit, numbering, dating and idempotency as S7-R2 and S7-R6; special orders and sublet on the line follow S7-R3 and S7-R4 with the category account. The billable lines post as today. Invoice reversal reverses them with the rest. The no-charge line is sent on the QuickBooks invoice as a line: the same labor and part items it would carry as a billable line, its quantities, price 0.00, the same tax code (tax is zero on zero), and the category name in the description, so the QuickBooks invoice reads like the PDF. The cost reaches the category account through the journal entry, never through the invoice. Vendor bills per line: a bill entered while the line is No Charge posts the line to the line's category account (S7-R3 per line); a line marked No Charge after its bill posted is reclassed from Cost of Parts to the category account when the customer invoice is created (S7-R4 per line); Mark as Billable after a bill posted to the category account reclasses back to Cost of Parts at invoicing; Create invoice has no confirmation today (SV-10312), so when at least one vendor bill's cost will move at invoicing and the location has an accounting integration, Create invoice first opens "Create invoice \[number\]?" with one "Moved from \[account\] to \[account\] $\[amount\]" row per pair of accounts, the amounts of the lines that move between the same two accounts added up (as the Close confirmation groups its rows, S3-R2) and the buttons Cancel and "Create invoice"; every other Create invoice runs as today, with no dialog. The Class rule of S7-R2 applies. The API owner confirms how today's $0 statement of a declined line is sent and makes the no-charge line the explicit case.

**New (v1.3 line 490 of the body, S7-R8):**

> - **S7-R8:** On a billable work order with no-charge lines (Story 12), the invoice is sent to QuickBooks as today with those lines at $0.00. For each no-charge line, the inventory journal entries of its picked stock parts debit the line's category account instead of Cost of Parts, with the same credit, numbering, dating and idempotency as S7-R2 and S7-R6; special orders and sublet on the line follow S7-R3 and S7-R4 with the category account. The billable lines post as today. Invoice reversal reverses them with the rest. The no-charge line is sent on the QuickBooks invoice as a line: the same labor and part items it would carry as a billable line, its quantities, price 0.00, the same tax code (tax is zero on zero), and the category name in the description, so the QuickBooks invoice reads like the PDF. The cost reaches the category account through the journal entry, never through the invoice. Vendor bills per line: a bill entered while the line is No Charge posts the line to the line's category account (S7-R3 per line); a line marked No Charge after its bill posted is reclassed from Cost of Parts to the category account when the customer invoice is created (S7-R4 per line); Mark as Billable after a bill posted to the category account reclasses back to Cost of Parts at invoicing; Create invoice has no confirmation today (SV-10312), so when at least one vendor bill's cost will move at invoicing and the location has an accounting integration, Create invoice first opens "Create invoice \[number\]?" with one "Moved from \[account\] to \[account\] $\[amount\]" row per pair of accounts, the amounts of the lines that move between the same two accounts added up (the same dialog Close shows for a move, S3-R2) and the buttons Cancel and "Create invoice"; every other Create invoice runs as today, with no dialog. The Class rule of S7-R2 applies. The API owner confirms how today's $0 statement of a declined line is sent and makes the no-charge line the explicit case.

**What changed (S7-R8):** Wording only for Create invoice on a billable work order with no-charge lines: its cost-move dialog is now described as "the same dialog Close shows for a move"; Create invoice behaviour is unchanged.

### S7-N5

**Old (v1.1 line 498, S7-N5):**

> - **S7-N5:** If Inventory Asset or Cost of Parts is not mapped at the location, no parts entry is sent at Close (stock parts and reclass entries), as invoicing sends none today for that location: the inventory journal entries need both accounts, so a shop that keeps no inventory in QuickBooks is never credited on Inventory Asset by Close alone. The shop supplies entry of S7-R4a still posts. The Close confirmation shows on the Stock parts and Special orders rows the note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped."

**New (v1.3 line 498 of the body, S7-N5):**

> - **S7-N5:** If Inventory Asset or Cost of Parts is not mapped at the location, no parts entry is sent at Close (stock parts and reclass entries), as invoicing sends none today for that location: the inventory journal entries need both accounts, so a shop that keeps no inventory in QuickBooks is never credited on Inventory Asset by Close alone. The shop supplies entry of S7-R4a still posts. The posting summary of S3-R2 shows on the Stock parts and Special orders rows the note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped."

**What changed (S7-N5):** The note "Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped." now shows on the Stock parts and Special orders rows of the Finance tab posting summary instead of a Close confirmation.

### Design line, Story 10

**Old (v1.1 line 600, Design line, Story 10):**

> **Design:** All flows v6.1, Flow 1: frames 3 (Shop supplies field), 7 (confirmation row), 8 (document line); Flow 0 frames 9 (QuickBooks row) and 11 (Edit Customer accepting Min without a percentage). Nothing left to draw.

**New (v1.3 line 600 of the body, Design line, Story 10):**

> **Design:** All flows v6.1, Flow 1: frames 3 (Shop supplies field), 8 (document line); Flow 0 frames 9 (QuickBooks row) and 11 (Edit Customer accepting Min without a percentage). The Shop supplies row sits in the Finance tab posting summary (Flow 1 frame 7, v6.2).

**What changed (Design line, Story 10):** The Story 10 design list drops "7 (confirmation row)" and "Nothing left to draw." and says the Shop supplies row sits in the Finance tab posting summary (Flow 1 frame 7, v6.2).

### S10-R3

**Old (v1.1 line 615, S10-R3):**

> - **S10-R3:** The Close confirmation (S3-R2) shows the row "Shop supplies $\[amount\]" with the note "Posted to \[work order's expense account\], credited to \[shop supplies account\]"; the shop supplies account is the income account of the existing "Shop supplies" item (Products And Services) in QuickBooks or the Shop supplies expense row in AccountingHub; the NO CHARGE document shows "Shop supplies $\[amount\]" in the Summary under Parts cost; the Internal Work Orders report shows it as a column (S9-R2).

**New (v1.3 line 615 of the body, S10-R3):**

> - **S10-R3:** The Finance tab posting summary (S3-R2) shows the row "Shop supplies $\[amount\]" with the note "Posted to \[work order's expense account\], credited to \[shop supplies account\]"; the shop supplies account is the income account of the existing "Shop supplies" item (Products And Services) in QuickBooks or the Shop supplies expense row in AccountingHub; the NO CHARGE document shows "Shop supplies $\[amount\]" in the Summary under Parts cost; the Internal Work Orders report shows it as a column (S9-R2).

**What changed (S10-R3):** The "Shop supplies $[amount]" row with its "Posted to …, credited to …" note is now in the Finance tab posting summary instead of the Close confirmation.

### S10-N1

**Old (v1.1 line 621, S10-N1):**

> - **S10-N1:** If the amount is $0.00, no row is shown in the confirmation and nothing is posted.

**New (v1.3 line 621 of the body, S10-N1):**

> - **S10-N1:** If the amount is $0.00, no row is shown in the posting summary and nothing is posted.

**What changed (S10-N1):** When the shop supplies amount is $0.00 no row shows in the posting summary (was the confirmation) and nothing posts.

### UFS-16 / UFS-17 / UFS-18

**Old (v1.1 line 776, UFS-16):**

> | Close confirmation | "This posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." ("This completes the work order, posts ..." when it is not yet Complete) | Confirmation dialog, Cancel / Close Work Order |

**New (v1.3 line 776 of the body, UFS-16):**

> | Close with a required original work order missing | "Close work order \[number\]?" with the Original work order and Original line selects and the warning "\[Category\] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView." | Dialog, Cancel / Close Work Order (disabled until one is picked); only on a no-charge work order of a category that requires it (S3-R2) |

**New (v1.3 line 777 of the body, UFS-17):**

> | Close with a cost move | "Close work order \[number\]?" with one "Moved from \[account\] to \[account\]" row per pair of accounts, amounts added up | Confirmation dialog, Cancel / Close Work Order; shown only when a vendor bill's cost moves at Close and the location has an accounting integration (S3-R2) |

**New (v1.3 line 778 of the body, UFS-18):**

> | Finance tab posting summary | "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." | Sentence under the posting summary rows (S3-R2); Close Work Order itself opens no confirmation |

**What changed (§8 rows):** the single "Close confirmation" message becomes three messages: the original-work-order dialog, the cost-move dialog, and the sentence under the Finance tab posting summary; "Close without integration" moves under the posting summary (S3-E4); the "work order changed" row now refers to an open Close dialog. Row numbers after 16 shift by 2.

### UFS-19 / UFS-21

**Old (v1.1 line 779, UFS-19):**

> | Close without integration | "This marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report." | Sentence in the confirmation |

**New (v1.3 line 781 of the body, UFS-21):**

> | Close without integration | "Closing marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report." | Sentence under the posting summary (S3-E4) |

**What changed (§8 rows):** the single "Close confirmation" message becomes three messages: the original-work-order dialog, the cost-move dialog, and the sentence under the Finance tab posting summary; "Close without integration" moves under the posting summary (S3-E4); the "work order changed" row now refers to an open Close dialog. Row numbers after 16 shift by 2.

### UFS-29 / UFS-31

**Old (v1.1 line 789, UFS-29):**

> | Work order changed under an open Close confirmation | "This work order changed. Review and close again." | Inline error in the dialog |

**New (v1.3 line 791 of the body, UFS-31):**

> | Work order changed under an open Close dialog | "This work order changed. Review and close again." | Inline error in the dialog |

**What changed (§8 rows):** the single "Close confirmation" message becomes three messages: the original-work-order dialog, the cost-move dialog, and the sentence under the Finance tab posting summary; "Close without integration" moves under the posting summary (S3-E4); the "work order changed" row now refers to an open Close dialog. Row numbers after 16 shift by 2.

## Notes for the rewrite

- The authoring library still loads v1.1 (`authoring/iwo_lib.py` line 33). Against v1.3 three of its anchors no longer match: KD-ALWAYS ("…changed under the open confirmation, S3-E5)"), PM-11 ("Cost on lines, in the Close confirmation") and T-PDATE ("Posting date → the date in the Close confirmation"), and its check `len(_ufs) != 43` will stop (v1.3 has 45 rows; UFS_STORY needs two more entries and the rows after 16 renumber).
- 124 quoted PRD sentences in 103 cases are no longer word for word in v1.3 (`AFFECTED-CASES-v1.3.json`, "quotes_not_in_v13"); every other PRD quote in the library still matches v1.3.
- Heuristic scan: 70 cases still describe a Close confirmation in their steps or plain results, and 26 still describe two hint lines or the QuickBooks mark (lists in the same file). The union of everything flagged is 158 cases; the 105 coded or quoted are the firm set.
- Nothing was written to TestRail, Jira, Google or Slack, and nothing was committed.
