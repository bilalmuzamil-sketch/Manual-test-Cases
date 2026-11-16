# Tiered Pricing PRD — what changed from page version 37 to page version 38

- Page: Confluence 938213378 "Tiered Pricing" (https://shopview.atlassian.net/wiki/spaces/PM/pages/938213378/Tiered+Pricing)
- v37: created 2026-11-12T22:23:12Z (our copy read 14 Nov 2026). **v38: created 2026-11-16T12:28:08Z by Matthew Barge, message "QA questions from
  Bilal (Nov 16)"** (our copy `CONFLUENCE-938213378-v38-read-2026-11-16.md`, read 16 Nov 2026 12:51Z).
- The in-body version still says **v0.17** (the new Change Log row is also labelled v0.17), so the page version (38) is the identifier (Rule 31 trap a).
- Method: both copies normalised (header comment removed, runs of spaces collapsed, blank lines dropped) and compared line by line:
  v37 841 lines, v38 844 lines; 20 lines removed, 23 added, 19 change blocks. Full list: `PRD-DIFF-v37-to-v38.txt`. Read 100% of both copies' changed lines.
- Every change block comes from Matt's answers; **no change was found that does not come from an answer.**
- Reports PRD 968687617 "Sales by Tier and Sales by Category": still **page version 21** (created 2026-11-12T22:08:41Z), unchanged, no diff owed.

| # | Requirement | What v38 says now (plain words) | From answer |
|---|---|---|---|
| 1 | S2-R30 (Archive / Delete a tier) | After the follower list, Archive says "Parts already on work orders keep their prices." and **Delete says "This can't be undone."** (a tier that can be deleted never priced a part). With no follower: just the question and its own last line. | Q2 |
| 2 | S2-R28 (a tier's page) | Breadcrumb starts at **Pricing ›** (no "Settings ›"). | Q1 |
| 3 | S3-R26 (a matrix's page) | Breadcrumbs **Pricing › Matrices › …**, **Pricing › Tiers › … › …**, **Categories › … › …**; new sentence: breadcrumbs start at the Settings page the user is on, never at Settings (a Settings crumb would open Organization settings). | Q1 |
| 3 | S3-R13 (Categories line) | New: **the Categories line can be changed only in Edit (or on a new matrix); picked categories show on the line at once; their parts are priced by this matrix only after Save (Create Matrix on a new matrix); Cancel puts them back.** | Q6 |
| 4 | S3-R16 (ranges) | **The first range always starts at $0.00 and the last has no end; neither can be removed**, so every cost is covered. | Q10 |
| 4 | S3-R32 (delete buttons) | Each range **between the first and the last** has a delete button; **a matrix with one or two ranges has none.** | Q10 |
| 5 | S3-R12 (what asks Change All) | "Renaming, changing its categories and turning the Part Sale switch on save without asking" becomes "Renaming and turning the Part Sale switch on save without asking; **categories save with the grid (S3-R13)**". | Q6 |
| 6 | S4-R4 (edit bar count) | Example added: switching a 3-range column to % Off counts **1 change** (boxes start empty); typing a value in each box makes **4**. | Q14 |
| 7 | S4-R12 (save message) | Each tier's change reads one of three ways: one rule and value everywhere ("Tier 5 is 28% margin."); same rule type, different value per range ("Tier 5 is" + one bullet per range); more than one rule type ("Tier 5 is multiple rules" + one bullet per type). Each tier is one of the three changes named before "and <n> more". | Q15 |
| 8 | S6-R1 (Matrices list) | Part Sale Matrix column: **the Part Sale rules in short when the matrix has separate Part Sale pricing, otherwise "Same as work orders"** (was On or Off). | Q16 |
| 9 | S7-R6 (a category's page) | Breadcrumb starts at **Categories ›**. | Q1 |
| 10 | S8-R10 (New Category) | **Cancel and Create Category in the page head**, like New Tier and New Matrix; nothing is created until Create Category. | Q19 |
| 11 | S8-R4 (Uncategorized) | Page read-only: no rename, no Delete; **Pricing Matrix and Tax Exempt grayed; only QuickBooks Products and Services can be changed** (when QuickBooks is connected). | Q21 |
| 12 | S9-R9 (a tier's Customers tab) | Channel filter defined: **Work orders = customers on the tier for work orders only, Part Sales = Part Sales only, Both = both**; each customer matches one option. | Q22 |
| 13 | S10-R14 (the tier a work order keeps) | New: **adding a line to a work order whose invoice is sent or paid puts it on a new work order, as today; that work order is new, so its parts are priced by the customer's current tier.** | Q24 |
| 14 | S12-R2 (price details) | On a **Part Sale whose matrix has no separate Part Sale pricing, the side reads "Same as work orders"**. | Q26 |
| 15 | S19-R15 (no help text on new pages) | One exception: the shared-matrix line above a category's grid (S7-R15). | Q18 |
| 16 | S19-R23 (Audit Log) | Example added: a rule-type change and the values entered after it are both recorded ("Tier 5: rule type Margin % → % Off; 3 range values changed"). | Q14 |
| 16 | **S19-R24 (NEW requirement)** | Columns and fields keep their place and width when a screen changes state: a row opening or closing, a search narrowing a list, an empty list, a filter chip changing, the Add Part row opening, or a page switching between view and edit. Nothing moves sideways or down. | Q31 |
| 17 | Messages table | "Archive or delete a tier" split into **Archive a tier** (unchanged words) and **Delete a tier**: "Delete <tier>?" — the same list when a tier follows it, then "This can't be undone."; Cancel, Delete. | Q2 |
| 18 | Messages table, "Matrix saved" | Per tier: one rule, one per range ("Tier 5 is" and bullets) or "Tier 5 is multiple rules" and bullets. | Q15 |
| 19 | Change Log | New row 2026-11-16, Matt Barge, "v0.17: QA's questions (Bilal): …" listing all 14 fixes. | all |

Answers that needed **no** PRD change (PRD stays): Q3, Q4, Q5, Q7, Q8, Q9, Q11, Q12, Q13, Q17, Q20, Q23, Q25, Q27 and, in the reports PRD, Q28, Q29, Q30.
Every "PRD fix needed" answer (Q1, Q2, Q6, Q10, Q14, Q15, Q18, Q19, Q21, Q22, Q24, Q26, Q31) and Q16 ("done in v38") is in v38.
Two small notes: Q14's answer names "S19-R19" for the Audit Log wording; v38 put the sentence in S19-R23 (the Audit Log requirement). Q19's answer also asks for
the developers' plan Phase 16 to change; the plan file we hold (11 Nov 2026) still says Save and Cancel — the plan informs and never overrules (Rule 30).

Epic SV-11692 re-swept 16 Nov 2026: still 54 tickets, none new. Ten stories were edited at 12:30Z, two minutes after v38 (SV-11694 Story 2, SV-11695 Story 3,
SV-12456 Story 4, SV-11696 Story 6, SV-12458 Story 7, SV-11704 Story 8, SV-11697 Story 9, SV-11699 Story 10, SV-11701 Story 12, SV-11709 Story 19); each edit is
the same change as v38 in the story's own words, nothing more (copies and word-level comparison: `jira/resweep-2026-11-16/`). No comments were added.
