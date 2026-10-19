# Splitting Sales Representatives: the two updated report specs, read against PRD v8 (19 Oct 2026)

Project: Splitting Sales Representatives (epic SV-10890, PO Chris Ward). Project type: V2 / upgrade. No build exists yet, so nothing here is build-verified.
Sources compared:
- **Sales By Representative (SBR)**: Confluence page 585629698, **version 28**. API metadata: `version.number = 28`, created 2026-10-12T14:43:32Z, message "Split Reps step 7: Sales Type column and filter (Labor / Parts / Part Sales), shop supplies with Labor, cross-references". Our older copy is **v24** (2026-08-24).
- **Sales By Customer (SBC)**: Confluence page 577634305, **version 21**. API metadata: `version.number = 21`, created 2026-10-06T16:59:39Z, message "Sales Type: Product Type renamed to Sales Type with options Part Sales / Service Sales; Story 3 matched to the build (Select all, Clear selection). Splitting Sales Representatives, SV-10890, Story 8". Our older copy is **v20** (2026-08-12).
- **PRD v8**: Confluence 919928833 (sources/CONFLUENCE-919928833-v8-2026-10-19.txt).

Every quote in this file was pulled by a script from the saved page text, so it is word for word. The verdict tables and notes are mine. The diffs are in DIFF-SBR-v24-v28.md and DIFF-SBC-v20-v21.md.

## a. Reading coverage (Rule 119)

| File | Size | Read | Coverage |
|---|---|---|---|
| report-specs/SBR-585629698-v28-2026-10-19.txt (plain text of the v28 page) | 96,584 bytes, 518 lines | lines 1-518 (1-170, 170-339, 339-509 of the first conversion, plus the 9 lines the second conversion added: the 4-row font-size table in S14-R12 and three context notes after §3 Margin, §3 Margin % and S5-R13) | 100% |
| report-specs/SBC-577634305-v21-2026-10-19.txt | 69,181 bytes, 488 lines | lines 1-488 | 100% |
| sources/CONFLUENCE-919928833-v8-2026-10-19.txt (PRD v8) | 42,356 bytes, 315 lines | lines 1-315. Lines that an earlier `cut` shortened (10, 13, 16, 19, 35, 100, 124, 125, 129, 134) were re-read in full. | 100% |
| report-specs/*.html (raw page bodies) | 191,317 / 149,709 bytes | Converted by script. Its tag inventory was checked, and the 5 SBR and 11 SBC "legacy-content" blocks (tables and notes held in a data attribute) were expanded into the text. | 100% via the text |
| Old copies: build/report-suite/source-verify-2026-08-26/specs/sales-by-representative.json (v24), sales-by-customer.json (v20) | 116,012 / 84,446 bytes | Converted with the same script and compared by script. Every changed code and changed line was read in DIFF-*.md. Unchanged text is identical to the new copy, which was read in full. | 100% of differences |
| baseline/V1-BASELINE-AND-INVARIANTS.md §d; review/TECHPLAN-JIRA-REVIEW.md §e | 107,649 / 47,361 bytes | only sections d (lines 224-244) and e (lines 261-295), as the task asks | 100% of those sections |

Conversion notes:
- Table rows are written as one line with cells separated by " | ".
- List items start with "- "; nested items are indented.
- The SBR page holds the characters "â‹¯" where the overflow-menu glyph (⋯) should be (S14-R1, S17-R1, S18-R7.2, S18-R9). This is in the page itself and is kept verbatim.

**Change logs:** neither page logs the new version. SBR's last change-log row is dated 2026-08-24 and SBC's 2026-08-12. The version messages above are the only record of what changed.

## Counts

| | CONFIRM | ADD | DIVERGE | Total rows |
|---|---|---|---|---|
| SBR v28 | 47 | 24 | 19 | 90 |
| SBC v21 | 16 | 10 | 3 | 29 |

Diff counts (by requirement code):
- **SBR v24 → v28:** 232 codes before, 236 after. 196 identical, 36 reworded, 4 added (S3-R9, S3-R10, S3-N2, S20-R6a), 0 removed. 12 changed blocks outside the codes.
- **SBC v20 → v21:** 240 codes before and after. 210 identical, 30 reworded, 0 added, 0 removed. 4 changed blocks outside the codes.

## b. Every feature-related requirement, quoted, with its verdict against PRD v8

What the verdicts mean:
- **CONFIRM**: the report spec says the same as the PRD.
- **ADD**: testable detail the PRD does not have. The case may cite the report spec.
- **DIVERGE**: the report spec and the PRD differ. Both are quoted. This is a PO question; never pick a side silently.

"Same as old copy?" says whether the sentence is word-for-word identical in v24 / v20. "yes" on a DIVERGE row means the report spec was simply not updated.


### b1. Sales By Representative v28

| # | Ref | Topic | Verdict | Against | Same as old copy? |
|---|---|---|---|---|---|
| 1 | line 17 | Filter overview (sales type) | **CONFIRM** | PRD S8-R1, PRD S8-R2 | no (changed) |
| 2 | line 23 | Customer record shows the representatives | **CONFIRM** | PRD S4-R19 | no (changed) |
| 3 | line 25 | Column selector: Sales Type off by default | **CONFIRM** | PRD S5-R20, PRD S5-R21 | no (changed) |
| 4 | line 26 | Remembered settings include sales type | **CONFIRM** | PRD S5-R22 | no (changed) |
| 5 | line 28 | Out of scope: per-line splits; a rep gets a whole side | **CONFIRM** | PRD L22 | no (changed) |
| 6 | line 36 | Key decision: "Each invoice appears under exactly one rep" | **DIVERGE** | PRD S5-R11, SBR S6-R7 | yes |
| 7 | line 39 | Key decision: parts and service representatives, shop supplies, shared fees | **CONFIRM** | PRD S4-R17, PRD S4-R18, PRD S5-R4, PRD S5-R6 | no (changed) |
| 8 | line 79 | Terminology: Sales Type | **CONFIRM** | PRD S5-R3, PRD S5-R10 | no (changed) |
| 9 | line 80 | Terminology: Snapshot (both sides captured; deleted staff name) | **CONFIRM** | PRD S5-R1, PRD S5-R2 | no (changed) |
| 10 | line 84 | Assumption: parts and service representative on the work order | **CONFIRM** | PRD S4-R17 | no (changed) |
| 11 | line 86 | Assumption: P / S invoice prefixes drive the Sales Type filter | **CONFIRM** | PRD S5-R3 | no (changed) |
| 12 | S3-R1 | Sales Type filter visible | **CONFIRM** | PRD S8-R1 | no (changed) |
| 13 | S3-R2 | Three options with checkboxes, in order | **CONFIRM** | PRD S8-R1, PRD S8-R2 | no (changed) |
| 14 | S3-R3 | All three selected on first load | **CONFIRM** | PRD S8-R1 | no (changed) |
| 15 | S3-R4 | What Labor / Parts / Part Sales include | **CONFIRM** | PRD S5-R3 | no (changed) |
| 16 | S3-R5 | "Labor, Parts" merged row; one side only when narrowed | **CONFIRM** | PRD S5-R10, PRD S5-R12 | no (changed) |
| 17 | S3-R6 | All three selected = no sales-type filter | **ADD** | PRD S8-R2 | no (changed) |
| 18 | S3-R7 | Changing the selection re-fetches | **ADD** | - | yes |
| 19 | S3-R8 | Contributor gate; invoice counted once | **CONFIRM** | PRD S5-R13, PRD S8-R2 | no (changed) |
| 20 | S3-R9 | Filter label "Sales Type: All" / names in option order | **CONFIRM** | PRD S8-R3 | no (changed) |
| 21 | S3-R10 | Export filter line, including "Sales Type: None" | **DIVERGE** | PRD S8-R4 | no (changed) |
| 22 | S3-N1 | No matching invoices: empty state | **ADD** | - | yes |
| 23 | S3-N2 | No option selected: "Sales Type: None", empty state | **CONFIRM** | PRD S8-R3, PRD S8-R5 | no (changed) |
| 24 | line 136 | Context note: filter now by side; SBC keeps Part Sales / Service Sales | **CONFIRM** | PRD L288, PRD S8-R7 | no (changed) |
| 25 | S4-R7 | Filters compose (sales type part of the intersection) | **ADD** | PRD S8-R2 | no (changed) |
| 26 | S5-R1 | Rep row only with a matching invoice (sales type part of the gate) | **ADD** | - | no (changed) |
| 27 | S5-R2 | Column order with Sales Type after Status | **CONFIRM** | PRD S5-R19, PRD S5-R21 | no (changed) |
| 28 | S5-R4 | (N) invoice count after the rep name | **CONFIRM** | PRD S5-R13 | yes |
| 29 | S5-R9 | "(Inactive)" marker; deleted staff use the captured name | **CONFIRM** | PRD S5-R2 | yes |
| 30 | S5-R10 | Column alignment; Totals merged cell includes Sales Type when shown | **ADD** | - | no (changed) |
| 31 | S5-R11 | Adjustments definition | **DIVERGE** | PRD S5-R6, SBR L45 | yes |
| 32 | S5-R12 | Every row ties out | **CONFIRM** | PRD S5-R6 | yes |
| 33 | S5-R13 | Shop Supplies go to the labor representative | **CONFIRM** | PRD S5-R4, PRD S5-R15a | no (changed) |
| 34 | S6-R3 | Detail row shows Sales Type when the column is shown | **CONFIRM** | PRD S5-R19 | no (changed) |
| 35 | S6-R7 | Each side under exactly one rep; split invoice under both | **CONFIRM** | PRD S5-R11 | no (changed) |
| 36 | S6-R9 | Detail-row order inside a rep | **ADD** | - | yes |
| 37 | S9-N1 | Labor Delta 0.0 for an invoice with no labor, "never blank ... or —" | **DIVERGE** | PRD S5-R15 | yes |
| 38 | S10-R5 | Grand totals; desktop merged cell includes Sales Type | **ADD** | PRD S5-R14 | yes |
| 39 | S11-R6 | Sales Type is not sortable | **ADD** | - | no (changed) |
| 40 | S12-R3a | Back navigation restores sales type | **ADD** | - | no (changed) |
| 41 | S13-R1 | Deactivation check counts distinct customers | **CONFIRM** | PRD S4-R21 | yes |
| 42 | S13-R4 | Deactivate dialog wording: "Their customer assignments will stay where they are." | **DIVERGE** | PRD S4-R20 | yes |
| 43 | S13-R10 | Assignments not modified by deactivation | **DIVERGE** | PRD S4-R20 | yes |
| 44 | S13-R11 | After deactivation the person is in the Assignments CSV with "No" | **DIVERGE** | PRD S4-R20 | yes |
| 45 | S13-N2 | Switch off: no precondition check, no warning | **ADD** | PRD S4-N2 | yes |
| 46 | S13-E1 | Deactivation never reassigns | **DIVERGE** | PRD S4-R20 | yes |
| 47 | S13-E3 | Reactivation brings assignments back | **DIVERGE** | PRD S4-R20 | yes |
| 48 | S14-R2 | Downloads respect sales type | **CONFIRM** | PRD S8-R4 | no (changed) |
| 49 | S14-R5 | Summary PDF columns (no Sales Type) | **ADD** | - | yes |
| 50 | S14-R6 | Expanded PDF includes Sales Type after Status | **CONFIRM** | PRD S5-R23 | no (changed) |
| 51 | S14-R15 | Summary CSV headers (no Sales Type) | **ADD** | - | yes |
| 52 | S14-R16 | Expanded CSV headers include Sales Type | **CONFIRM** | PRD S5-R23 | no (changed) |
| 53 | S14-R18 | # Invoices same as on-screen (N) | **CONFIRM** | PRD S5-R13 | yes |
| 54 | S14-R19 | Unassigned row in exports | **ADD** | PRD S5-R18 | yes |
| 55 | S14-R20 | Location column position in exports | **ADD** | - | yes |
| 56 | S14-R20a | CSV filter lines include Sales Type | **CONFIRM** | PRD S8-R4 | no (changed) |
| 57 | S14-E3 | Empty-data export still generates | **DIVERGE** | PRD S8-R4 | yes |
| 58 | S15-R1 | Export name "Sales Rep Assignments" | **DIVERGE** | PRD S4-R23 | yes |
| 59 | S15-R2 | Dialog note: active and inactive reps listed | **DIVERGE** | PRD S4-R20 | yes |
| 60 | S15-R3 | File name sales-rep-assignments.csv | **ADD** | - | yes |
| 61 | S15-R4 | Headings: Customer Name, Sales Rep, Rep is active?, Side | **DIVERGE** | PRD S4-R23 | no (changed) |
| 62 | S15-R5 | One row per person; Side values | **DIVERGE** | PRD S4-R23 | no (changed) |
| 63 | S15-R6 | "Rep is active?" = staff active status | **DIVERGE** | PRD S4-R20 | yes |
| 64 | S15-R7 | Sort: customer A to Z, then rep A to Z | **ADD** | - | yes |
| 65 | S15-R9 | Name drift: "still one row per customer" | **DIVERGE** | SBR S15-R5, PRD S4-R23 | yes |
| 66 | S15-R10 | Customers with no rep are not listed | **ADD** | - | yes |
| 67 | S17-R1 | Mobile: Sales Type control operable on touch | **ADD** | - | no (changed) |
| 68 | S18-R7.2 | Toolbar order: Sales Type between Date Range and Invoice Status | **ADD** | - | no (changed) |
| 69 | S18-R13 | Location column right after Status | **DIVERGE** | SBR S5-R2, PRD S5-R19 | yes |
| 70 | S19-R1 | Field on standard work order (splittable); part sale single; read-only in History | **CONFIRM** | PRD S2-R17, PRD S2-N2, PRD S1-N1 | no (changed) |
| 71 | S19-R2 | Only reps with the toggle on are offered | **CONFIRM** | PRD S1-R8, PRD S1-N2 | yes |
| 72 | S19-R3 | New work order opens Unassigned | **DIVERGE** | PRD S4-R24, PRD S4-R25, PRD S4-R26 | yes |
| 73 | S19-R4 | Save on change | **CONFIRM** | PRD S1-R14 | yes |
| 74 | S19-R5 | Read-only when Invoiced or Paid | **CONFIRM** | PRD S2-R17, PRD S2-E4 | yes |
| 75 | S19-R6 | Both sides captured at invoicing; customer fallback per side | **CONFIRM** | PRD S4-R17, PRD S4-R18, PRD S5-R1, PRD S5-R18 | no (changed) |
| 76 | S19-R7 | Customer sidebar labels | **CONFIRM** | PRD S4-R19 | no (changed) |
| 77 | S19-R8 | Accessible name "Sales Rep" | **ADD** | - | yes |
| 78 | S19-E1 | Inactive person shown in the field | **CONFIRM** | PRD S1-E2 | no (changed) |
| 79 | S19-N2 | Changing the work order does not alter past invoices | **CONFIRM** | PRD S5-R2 | yes |
| 80 | S20-R2 | Toggleable list starts with Sales Type | **CONFIRM** | PRD S5-R20 | no (changed) |
| 81 | S20-R6 | First visit: Sales Type off | **CONFIRM** | PRD S5-R21 | no (changed) |
| 82 | S20-R6a | Sales Type off for users with saved choices; stays on once turned on | **DIVERGE** | PRD L69, PRD S5-R22 | no (changed) |
| 83 | S20-R8 | Exports always include Sales Type in the Expanded versions | **CONFIRM** | PRD S5-R23 | no (changed) |
| 84 | S22-R2 | Show Unassigned off: an unassigned side counts nowhere | **CONFIRM** | PRD S5-R14, PRD S5-R18 | no (changed) |
| 85 | S22-R3 | Unassigned row rolls up unassigned sides | **CONFIRM** | PRD S5-R18 | no (changed) |
| 86 | S22-R4 | Unassigned pinned to the top | **ADD** | - | yes |
| 87 | S22-R5 | Unassigned row behaves like a rep row; never "(Inactive)" | **ADD** | - | yes |
| 88 | S23-R1 | Remembered per browser, including sales type | **CONFIRM** | PRD S5-R22 | no (changed) |
| 89 | S23-R3 | Invalid remembered value falls back to the default | **ADD** | PRD L69 | yes |
| 90 | S23-R4 | First-visit defaults include Sales Type all and column off | **CONFIRM** | PRD S8-R1, PRD S5-R21 | no (changed) |

#### SBR line 17: Filter overview (sales type) (CONFIRM)

> **SBR v28 line 17:** "The user can filter the on-screen report by date range, sales type (Labor, Parts and Part Sales, in any combination), invoice payment status (All Statuses / Unpaid / Partially Paid / Paid), and location (one, several, or all of the locations the user has access to). A Show Unassigned toggle adds a rolled-up "Unassigned" row for invoices with no assigned rep."

> **PRD v8 S8-R1:** "S8-R1: Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default."

> **PRD v8 S8-R2:** "S8-R2: Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12)."

#### SBR line 23: Customer record shows the representatives (CONFIRM)

> **SBR v28 line 23:** "The customer record shows the customer's sales representatives (S19-R7)."

> **PRD v8 S4-R19:** "S4-R19: The customer page shows the representatives with the window's labels, in the window's order: "Sales Representative" or "Sales Representative - Service Labor", then "Sales Representative - Service Parts" when added, then "Sales Representative - Part Sales" when added. An empty one reads "Unassigned". The Sales Representative rows show on every customer, whether or not the customer has an address. The other fields on the page keep today's rule of showing only when the customer has an address."

#### SBR line 25: Column selector: Sales Type off by default (CONFIRM)

> **SBR v28 line 25:** "A column selector button lets the user show or hide the Sales Type column (off by default) and any of the nine metric columns. The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) cannot be hidden."

> **PRD v8 S5-R20:** "S5-R20: The Sales Type column is offered in the report's column selector, first in its list."

> **PRD v8 S5-R21:** "S5-R21: The Sales Type column is off by default on screen, for every user."

#### SBR line 26: Remembered settings include sales type (CONFIRM)

> **SBR v28 line 26:** "The report remembers the user's filter and view settings (date range, sales type, invoice status, location, Show Unassigned, column visibility, and sort) and restores them on the next visit (Story 23)."

> **PRD v8 S5-R22:** "S5-R22: A user who turns the Sales Type column on keeps it on for later visits."

Note: The PRD Release-day reset is handled under S20-R6a.

#### SBR line 28: Out of scope: per-line splits; a rep gets a whole side (CONFIRM)

> **SBR v28 line 28:** "Per-line-item rep splits. A rep is credited with a whole side of an invoice, its parts or its service, never with individual line items. The two sides are defined in the Splitting Sales Representatives PRD (epic SV-10890)."

> **PRD v8 line 23:** "More than two people on one work order, and per-line representatives."

#### SBR line 36: Key decision: "Each invoice appears under exactly one rep" (DIVERGE)

> **SBR v28 line 36:** "The report is grouped per-rep, not flat per-invoice. Each contributing rep occupies one summary row with chevron-expanded invoice detail rows underneath. Each invoice appears under exactly one rep — the Sales Rep credited to the invoice at the time of invoicing — or under the "Unassigned" row when it has no rep."

> **PRD v8 S5-R11:** "S5-R11: Two different people on one work order are always two rows."

> **SBR v28 S6-R7:** "S6-R7: Each side of an invoice appears under exactly one rep (or the Unassigned row). A service invoice whose labor and parts sides belong to two people appears under both, once with its Labor row and once with its Parts row (the Splitting Sales Representatives PRD (epic SV-10890), Story 5)."

Note: This Key Decisions line was not updated in v28 (identical to v24). It contradicts the PRD and the spec's own updated S6-R7: a split invoice appears under two people.

#### SBR line 39: Key decision: parts and service representatives, shop supplies, shared fees (CONFIRM)

> **SBR v28 line 39:** "Parts and service representatives. A customer, a Work Order and an invoice each carry a parts representative and a service representative, and one person may hold both. At invoice creation both sides are captured onto the invoice. When the Work Order has nobody on either side, each side takes the customer's representative for that side (a part sale takes the customer's Part Sales choice for the whole sale); when that is also absent, the side is unassigned (Story 22). Labor dollars, hours and shop supplies are credited to the labor representative and parts dollars to the parts representative; whole-invoice fees and discounts are shared by the size of each side. Each side shows as its own row with a Sales Type: Labor, Parts or Part Sales. Every rule for the two sides is owned by the Splitting Sales Representatives PRD (epic SV-10890), Stories 4 and 5. This report applies them."

> **PRD v8 S4-R17:** "S4-R17: A work order invoiced with nobody on either side is credited with the customer's Service Parts person on the parts side and the Service Labor person on the labor side. A customer that is not split gives its one person both sides."

> **PRD v8 S4-R18:** "S4-R18: A part sale invoiced with no representative is credited, for the whole sale, to the person new part sales get from the customer (S4-R26), or to nobody when the Part Sales field reads "Unassigned"."

> **PRD v8 S5-R4:** "S5-R4: A Labor row is credited with Labor Invoiced, Labor Margin, labor-line fees and discounts, Hrs Worked, Hrs Invoiced, Labor Delta and all of the invoice's Shop Supplies, including an amount typed by hand."

> **PRD v8 S5-R6:** "S5-R6: Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00."

#### SBR line 79: Terminology: Sales Type (CONFIRM)

> **SBR v28 line 79:** "Sales Type: where an invoice row's money comes from. "Labor" is the labor side of a service invoice, "Parts" its parts side, and "Part Sales" a part sale invoice. One person's Labor and Parts on the same invoice show as one row reading "Labor, Parts" when the filter includes both."

> **PRD v8 S5-R3:** "S5-R3: The report reads every invoice as one row per representative per Sales Type: "Labor" for a work order's labor side, "Parts" for its parts side, and "Part Sales" for a part sale."

> **PRD v8 S5-R10:** "S5-R10: When one person, or Unassigned, holds both the Labor and the Parts side of a work order and the Sales Type filter includes both, the two show as one row whose Sales Type reads "Labor, Parts" and whose figures are the sum of both sides."

#### SBR line 80: Terminology: Snapshot (both sides captured; deleted staff name) (CONFIRM)

> **SBR v28 line 80:** "Snapshot: the parts representative and the service representative captured onto the invoice at creation time, each the Work Order's rep for that side or, when the Work Order has nobody on either side, the customer's default for that side. Each is stored as the rep's id and a denormalized rep display name. Immutable on past invoices. The denormalized name is what the report displays (and sorts on) for a rep whose staff record is later deleted (S5-R9)."

> **PRD v8 S5-R1:** "S5-R1: When a work order is invoiced, the parts representative and the labor representative in effect are both captured on the invoice, by name."

> **PRD v8 S5-R2:** "S5-R2: The names captured on the invoice do not change afterwards, including when a staff member is renamed or deactivated. That is what the invoice stores. The report labels each person with their current name, as it does today, so a renamed representative stays one row; it shows the captured name only when the staff record no longer exists."

#### SBR line 84: Assumption: parts and service representative on the work order (CONFIRM)

> **SBR v28 line 84:** "A Work Order carries a parts representative and a service representative, settable and changeable before invoicing. At invoice creation both are captured onto the invoice; when the Work Order has nobody on either side, each side takes the customer's default for that side; when that is absent, the side is unassigned."

> **PRD v8 S4-R17:** "S4-R17: A work order invoiced with nobody on either side is credited with the customer's Service Parts person on the parts side and the Service Labor person on the labor side. A customer that is not split gives its one person both sides."

#### SBR line 86: Assumption: P / S invoice prefixes drive the Sales Type filter (CONFIRM)

> **SBR v28 line 86:** "Invoice numbers always start with P (Parts) or S (Service) — a system invariant the Sales Type filter relies on to tell a part sale from a service invoice."

> **PRD v8 S5-R3:** "S5-R3: The report reads every invoice as one row per representative per Sales Type: "Labor" for a work order's labor side, "Parts" for its parts side, and "Part Sales" for a part sale."

#### SBR S3-R1: Sales Type filter visible (CONFIRM)

> **SBR v28 S3-R1:** "S3-R1: A "Sales Type" filter is visible in the toolbar."

> **PRD v8 S8-R1:** "S8-R1: Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default."

#### SBR S3-R2: Three options with checkboxes, in order (CONFIRM)

> **SBR v28 S3-R2:** "S3-R2: Its menu offers three options, each with a checkbox, in this order: "Labor", "Parts" and "Part Sales". Any combination can be selected."

> **PRD v8 S8-R1:** "S8-R1: Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default."

> **PRD v8 S8-R2:** "S8-R2: Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12)."

#### SBR S3-R3: All three selected on first load (CONFIRM)

> **SBR v28 S3-R3:** "S3-R3: All three options are selected on first load (no remembered setting — Story 23)."

> **PRD v8 S8-R1:** "S8-R1: Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default."

#### SBR S3-R4: What Labor / Parts / Part Sales include (CONFIRM)

> **SBR v28 S3-R4:** "S3-R4: "Labor" includes the labor side of every service invoice, "Parts" the parts side of every service invoice, and "Part Sales" every invoice whose number starts with P."

> **PRD v8 S5-R3:** "S5-R3: The report reads every invoice as one row per representative per Sales Type: "Labor" for a work order's labor side, "Parts" for its parts side, and "Part Sales" for a part sale."

#### SBR S3-R5: "Labor, Parts" merged row; one side only when narrowed (CONFIRM)

> **SBR v28 S3-R5:** "S3-R5: With "Labor" and "Parts" both selected, one person's Labor and Parts sides of the same invoice show as one invoice row whose Sales Type reads "Labor, Parts". With only one of them selected, only that side shows."

> **PRD v8 S5-R10:** "S5-R10: When one person, or Unassigned, holds both the Labor and the Parts side of a work order and the Sales Type filter includes both, the two show as one row whose Sales Type reads "Labor, Parts" and whose figures are the sum of both sides."

> **PRD v8 S5-R12:** "S5-R12: With the Sales Type filter narrowed to Labor or to Parts, only that side's row shows (Story 8)."

Note: The SBR sentence names only "one person"; PRD S5-R10 also merges the two sides when Unassigned holds both. Not a conflict, but the tester should use the PRD for the Unassigned case.

#### SBR S3-R6: All three selected = no sales-type filter (ADD)

> **SBR v28 S3-R6:** "S3-R6: With all three options selected, the report applies no sales-type filter."

> **PRD v8 S8-R2:** "S8-R2: Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12)."

Note: Testable detail the PRD lacks: with all three selected the result equals the unfiltered report.

#### SBR S3-R7: Changing the selection re-fetches (ADD)

> **SBR v28 S3-R7:** "S3-R7: Changing the selection re-fetches and re-renders the report."

Note: Loading indicator on change.

#### SBR S3-R8: Contributor gate; invoice counted once (CONFIRM)

> **SBR v28 S3-R8:** "S3-R8: The Sales Type filter is part of the contributor gate and narrows every metric. A rep appears only if they have ≥1 matching invoice side after this filter (Story 5). A rep's invoice count counts an invoice once even when two of its sides match. For rendered reps, summary totals, invoice detail rows, the grand Totals indicator, and the (N) count all reflect only matching invoices."

> **PRD v8 S5-R13:** "S5-R13: A representative counts an invoice once, even when they have two rows for it. When two people split an invoice, each counts it once, so the representatives' invoice counts can add up to more than the shop's."

> **PRD v8 S8-R2:** "S8-R2: Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12)."

#### SBR S3-R9: Filter label "Sales Type: All" / names in option order (CONFIRM)

> **SBR v28 S3-R9:** "S3-R9: The filter reads "Sales Type: All" with every option selected, and otherwise the selected options' names in option order, for example "Sales Type: Labor, Parts" or "Sales Type: Part Sales"."

> **PRD v8 S8-R3:** "S8-R3: With all three selected the filter reads "Sales Type: All". With none it reads "Sales Type: None". Otherwise it reads the selected names in option order, for example "Sales Type: Labor, Parts"."

#### SBR S3-R10: Export filter line, including "Sales Type: None" (DIVERGE)

> **SBR v28 S3-R10:** "S3-R10: The filter line in the PDF header and the CSV reads the same: "Sales Type: All", "Sales Type: None", or the selected names, for example "Sales Type: Labor, Parts"."

> **PRD v8 S8-R4:** "S8-R4: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file."

Note: SBR lists a "Sales Type: None" line in the PDF header and CSV, which means a file is made with no option selected (and S14-E3 says an empty export still generates). PRD S8-R4: with no option selected Export shows "Empty export" and makes no file.

#### SBR S3-N1: No matching invoices: empty state (ADD)

> **SBR v28 S3-N1:** "S3-N1: If no invoices match, the report shows the empty state (Story 16)."

#### SBR S3-N2: No option selected: "Sales Type: None", empty state (CONFIRM)

> **SBR v28 S3-N2:** "S3-N2: With no option selected, the filter reads "Sales Type: None", the report includes no invoices, and the empty state shows (Story 16)."

> **PRD v8 S8-R3:** "S8-R3: With all three selected the filter reads "Sales Type: All". With none it reads "Sales Type: None". Otherwise it reads the selected names in option order, for example "Sales Type: Labor, Parts"."

> **PRD v8 S8-R5:** "S8-R5: With no option selected the report includes no invoices and shows its empty state."

#### SBR line 136: Context note: filter now by side; SBC keeps Part Sales / Service Sales (CONFIRM)

> **SBR v28 line 136:** "* Context note: this filter used to separate part sales from service work orders ("Product Type", then "Sales Type: Part Sales / Service Sales"). Now that one service invoice can credit a labor and a parts representative (the Splitting Sales Representatives PRD (epic SV-10890), Story 5), it filters by side instead. Sales By Customer keeps "Part Sales" and "Service Sales" (that PRD, Story 8)."

> **PRD v8 line 288:** "* Context note: Sales By Representative used to filter by kind of invoice, like Sales By Customer. Now that one work order can credit two people, it filters by side instead: Labor, Parts or Part Sales."

> **PRD v8 S8-R7:** "S8-R7: Its two options read "Part Sales" and "Service Sales"."

#### SBR S4-R7: Filters compose (sales type part of the intersection) (ADD)

> **SBR v28 S4-R7:** "S4-R7: Filters compose. When multiple filters are active, every metric reflects the intersection — only invoices matching ALL active filters (date range, sales type, invoice status, location) contribute, and a rep appears only if ≥1 invoice matches all of them."

> **PRD v8 S8-R2:** "S8-R2: Any combination can be selected. Rows, summary rows, totals and invoice counts follow the selection (S5-R10 to S5-R12)."

#### SBR S5-R1: Rep row only with a matching invoice (sales type part of the gate) (ADD)

> **SBR v28 S5-R1:** "S5-R1: A sales rep occupies a summary row if and only if they have at least one non-reversed invoice matching the current filter set (date range, sales type, invoice status, and location, together). Reps with no matching invoices do not appear — there is no blank placeholder row. A rep's current active/inactive (toggle) state does not affect whether they appear, only how they are labeled (S5-R9)."

Note: Combined with PRD S5-N1, a side with no dollars still makes a $0.00 row, so the person appears.

#### SBR S5-R2: Column order with Sales Type after Status (CONFIRM)

> **SBR v28 S5-R2:** "S5-R2: The columns appear left-to-right: Date, Invoice, Customer, Status, Sales Type, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. (15 columns: five leading identifier columns, nine metric columns, and Subtotal.) Sales Type is filled on invoice detail rows only and reads "Labor", "Parts", "Part Sales" or "Labor, Parts" (the Splitting Sales Representatives PRD (epic SV-10890), S5-R19). It is off by default on screen and can be turned on from the column selector (Story 20); while it is off, the columns that follow sit one place to the left."

> **PRD v8 S5-R19:** "S5-R19: An invoice row carries a "Sales Type" column, after Status, reading "Labor", "Parts", "Part Sales" or "Labor, Parts"."

> **PRD v8 S5-R21:** "S5-R21: The Sales Type column is off by default on screen, for every user."

Note: Adds testable detail the PRD lacks: Sales Type is blank on rep summary rows, and the columns after it shift left when it is off.

#### SBR S5-R4: (N) invoice count after the rep name (CONFIRM)

> **SBR v28 S5-R4:** "S5-R4: The number of invoices contributing to that rep in the current filtered view is displayed in parentheses after the rep's name, in a smaller, subdued grey font — e.g., Mary Smith (12). Because a rep only appears when they have ≥1 matching invoice (S5-R1), the count is always ≥1."

> **PRD v8 S5-R13:** "S5-R13: A representative counts an invoice once, even when they have two rows for it. When two people split an invoice, each counts it once, so the representatives' invoice counts can add up to more than the shop's."

#### SBR S5-R9: "(Inactive)" marker; deleted staff use the captured name (CONFIRM)

> **SBR v28 S5-R9:** "S5-R9: Inactive-rep marker. When a rendered rep's sales-rep toggle is currently off (or their staff record has been deleted) but they have matching invoices, their display name is followed by a subdued "(Inactive)" tag — e.g., Mary Smith (Inactive) (12) — rendered in the same muted grey as the count. A rep whose toggle is currently on shows no tag. The tag is a display marker only; it does not change the rep's metrics, position in the A→Z order, or expandability. For a rep whose staff record has been deleted, both the display name and the A→Z sort position come from the denormalized rep-name snapshot on the rep's most recent matching invoice (by invoice date, ties broken by invoice number per S6-R9), so a name that drifted across invoices resolves deterministically and the row still shows a historical name and sorts correctly."

> **PRD v8 S5-R2:** "S5-R2: The names captured on the invoice do not change afterwards, including when a staff member is renamed or deactivated. That is what the invoice stores. The report labels each person with their current name, as it does today, so a renamed representative stays one row; it shows the captured name only when the staff record no longer exists."

#### SBR S5-R10: Column alignment; Totals merged cell includes Sales Type when shown (ADD)

> **SBR v28 S5-R10:** "S5-R10: Column alignment is a hard invariant. Every rep summary row and every invoice detail row renders exactly the report's column count in the declared left-to-right order; a cell with nothing to show is rendered blank in its position, never shifted or wrapped. Both forms of the grand Totals indicator are exempt (the desktop Totals row merges the leading identifier columns, Sales Type included when it is shown; the mobile bar is not a table row — see S10-R5)."

#### SBR S5-R11: Adjustments definition (DIVERGE)

> **SBR v28 S5-R11:** "S5-R11: Adjustments is the signed net of invoice-level fees and discounts across the row's invoices: fees count positive, discounts count negative. A line-level fee or discount stays folded into its own line's Labor or Parts value; an invoice-level amount is never allocated into the Labor or Parts columns."

> **PRD v8 S5-R6:** "S5-R6: Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00."

> **SBR v28 line 45:** "Adjustments = the signed net of invoice-level fees and discounts across the row's invoices: fees count positive, discounts count negative. A line-level fee or discount stays folded into its own line's Labor or Parts value; an invoice-level amount is never allocated into Labor or Parts, because a flat fee has no labor/parts basis. No cost attaches to an adjustment, so its full amount flows into Margin."

Note: Unchanged since v24. SBR defines a row's Adjustments as the net of invoice-level fees and discounts "across the row's invoices", with no sharing. Read literally, a split invoice's Labor row and Parts row would each show the whole fee or discount. PRD S5-R6 shares it by the size of each side. Which column holds the share is baseline Q5.

#### SBR S5-R12: Every row ties out (CONFIRM)

> **SBR v28 S5-R12:** "S5-R12: Every row ties out: Labor Invoiced + Parts Invoiced + Shop Supplies + Adjustments = Subtotal, and Labor Margin + Parts Margin + Adjustments = Margin — on rep summary rows, invoice detail rows, and the grand Totals indicator alike."

> **PRD v8 S5-R6:** "S5-R6: Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00."

Note: The PRD example ties out on both rows: Labor 600.00 + 30.00 + (30.00) = 600.00; Parts 400.00 + (20.00) = 380.00.

#### SBR S5-R13: Shop Supplies go to the labor representative (CONFIRM)

> **SBR v28 S5-R13:** "S5-R13: Shop Supplies is the shop-supply charge on the row's invoices, summed across them. It sits immediately to the left of Adjustments, counts toward Subtotal, and is never allocated into the Labor or Parts columns. A representative is credited for the shop supplies on their invoices. On a service invoice with two representatives, the whole shop supplies charge goes to the labor representative (the Splitting Sales Representatives PRD (epic SV-10890), S5-R4)."

> **PRD v8 S5-R4:** "S5-R4: A Labor row is credited with Labor Invoiced, Labor Margin, labor-line fees and discounts, Hrs Worked, Hrs Invoiced, Labor Delta and all of the invoice's Shop Supplies, including an amount typed by hand."

> **PRD v8 S5-R15a:** "S5-R15a: On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when it has none."

Note: SBR says nothing about a Part Sales row's shop supplies (PRD S5-R15a), or about a typed-in amount (PRD S5-R4).

#### SBR S6-R3: Detail row shows Sales Type when the column is shown (CONFIRM)

> **SBR v28 S6-R3:** "S6-R3: Each detail row shows, left to right: the invoice's date, the invoice number, the customer name, the payment status badge, the Sales Type when that column is shown, and the row's values for Labor Delta and the money columns."

> **PRD v8 S5-R19:** "S5-R19: An invoice row carries a "Sales Type" column, after Status, reading "Labor", "Parts", "Part Sales" or "Labor, Parts"."

#### SBR S6-R7: Each side under exactly one rep; split invoice under both (CONFIRM)

> **SBR v28 S6-R7:** "S6-R7: Each side of an invoice appears under exactly one rep (or the Unassigned row). A service invoice whose labor and parts sides belong to two people appears under both, once with its Labor row and once with its Parts row (the Splitting Sales Representatives PRD (epic SV-10890), Story 5)."

> **PRD v8 S5-R11:** "S5-R11: Two different people on one work order are always two rows."

#### SBR S6-R9: Detail-row order inside a rep (ADD)

> **SBR v28 S6-R9:** "S6-R9: Within an expanded rep (and within the Unassigned row), invoice detail rows are ordered by invoice date descending (newest first), tie-broken by invoice number ascending by the numeric portion after the P/S prefix (numeric, not lexical — so S999 precedes S1000); if both the date and the numeric portion tie (e.g., P100 and S100 on the same day), P (Parts) sorts before S (Service). This order is independent of the rep-row column sort (Story 11, which reorders rep summary rows only) and is the same order used in the Expanded View PDF per-rep tables (S14-R6) and the Expanded CSV (S14-R16)."

Note: Unchanged since v24. A split invoice has one row under each person, so the order rule applies per person.

#### SBR S9-N1: Labor Delta 0.0 for an invoice with no labor, "never blank ... or —" (DIVERGE)

> **SBR v28 S9-N1:** "S9-N1: An invoice with neither billed labor hours nor clocked technician hours (e.g., a parts-only invoice with no labor and no time logged) shows Labor Delta 0.0 in the default color — never blank, "N/A," or "—". An invoice with clocked technician hours but no billed labor line shows the resulting negative delta per §3 (e.g., -3.0 in red) — this worked-but-unbilled signal is not suppressed to 0.0."

> **PRD v8 S5-R15:** "S5-R15: On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero."

Note: Unchanged since v24. On a Parts row, PRD S5-R15 shows a dash in the hours columns, and Labor Delta is credited to the Labor row (S5-R4). SBR says such a row shows 0.0 and never "—".

#### SBR S10-R5: Grand totals; desktop merged cell includes Sales Type (ADD)

> **SBR v28 S10-R5:** "S10-R5: Grand Totals indicator — responsive. Present whenever at least one summary row exists (a rep row or the Unassigned row); hidden only during loading (S16-R4) and in the empty state (Story 16). The grand totals are server-computed over the full filtered result set — every matching non-reversed invoice across every rep, independent of which rep rows are currently expanded or loaded — and are delivered with the summary payload; the client does not derive them by summing loaded rows."

> **PRD v8 S5-R14:** "S5-R14: With Show Unassigned on, the report's totals are the same whether invoices are split or not. With it off, a side credited to Unassigned is left out of the totals, as Unassigned money is today."

#### SBR S11-R6: Sales Type is not sortable (ADD)

> **SBR v28 S11-R6:** "S11-R6: Identifier columns are not sortable (Date, Invoice, Customer, Status, Sales Type do not respond to header clicks). The Date header carries the expand/collapse-all chevron, not a sort affordance."

#### SBR S12-R3a: Back navigation restores sales type (ADD)

> **SBR v28 S12-R3a:** "S12-R3a: Pressing the browser back button from either destination returns the user to the report with all state intact — date range, sales type, invoice status, location, Show Unassigned, every rep's expansion state, and scroll position — exactly as they were. Back-navigation must not trigger a full report reload. (This differs from a deliberate page reload, which restores the persisted filters/columns/sort but resets expansion and scroll — Story 23.)"

#### SBR S13-R1: Deactivation check counts distinct customers (CONFIRM)

> **SBR v28 S13-R1:** "S13-R1: When the user toggles the staff member's active status off, the system first runs a precondition check returning the count of distinct customers currently assigned to that staff member as their sales rep, plus a flag indicating whether any assignments exist."

> **PRD v8 S4-R21:** "S4-R21: The warning shown before deactivating a sales representative counts every customer where they are in the first field, Service Parts or Part Sales, and counts each customer once."

Note: Not reworded for three fields, but "distinct customers" agrees with "counts each customer once". The PRD is more specific about which fields count.

#### SBR S13-R4: Deactivate dialog wording: "Their customer assignments will stay where they are." (DIVERGE)

> **SBR v28 S13-R4:** "S13-R4: The dialog body shows "{Staff Name} is the sales rep on {N} customer{s}." — where the noun is singular for N=1 ("1 customer") and plural otherwise ("3 customers") — followed by the reassurance line "Their customer assignments will stay where they are.""

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Unchanged since v24. Baseline Q1.

#### SBR S13-R10: Assignments not modified by deactivation (DIVERGE)

> **SBR v28 S13-R10:** "S13-R10: Customer assignments are not modified by deactivation. Every customer stays assigned to this rep; denormalized rep names and past invoice snapshots are preserved."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Unchanged since v24. Baseline Q1.

#### SBR S13-R11: After deactivation the person is in the Assignments CSV with "No" (DIVERGE)

> **SBR v28 S13-R11:** "S13-R11: After deactivation, the staff member's sales-rep toggle state is unchanged by this flow. Because the deactivation set their staff-active status to inactive, they appear in the Sales Rep Assignments CSV with "Rep is active?" = "No" (S15-R6) — that column is driven by staff-active status, not the toggle. Separately, if their sales-rep toggle is later turned off, they render with the "(Inactive)" marker (S5-R9) in this report while retaining their credit."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Under S4-R20 a deactivated person is removed from every customer field, so they would have no Assignments row at all.

#### SBR S13-N2: Switch off: no precondition check, no warning (ADD)

> **SBR v28 S13-N2:** "S13-N2: If the staff member does not have the sales-rep toggle on, the precondition check is skipped and no warning is shown."

> **PRD v8 S4-N2:** "S4-N2: Turning off a staff member's Sales Representative switch, without deactivating their account, leaves them in the customer fields they hold, as today."

Note: Relevant to baseline Q2.

#### SBR S13-E1: Deactivation never reassigns (DIVERGE)

> **SBR v28 S13-E1:** "S13-E1: Deactivation never forces reassignment, blocks on assignments, or auto-reassigns; the customer's rep relationship is preserved exactly."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Baseline Q1.

#### SBR S13-E3: Reactivation brings assignments back (DIVERGE)

> **SBR v28 S13-E3:** "S13-E3: A deactivated rep can be reactivated anytime via the standard toggle; assignments re-surface immediately with no extra action. Reactivation never shows the warning dialog."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Baseline Q1, option C.

#### SBR S14-R2: Downloads respect sales type (CONFIRM)

> **SBR v28 S14-R2:** "S14-R2: All four downloads respect the currently-active filters (date range, sales type, invoice status, location, Show Unassigned) and reflect the full result set for those filters, not the on-screen expansion state."

> **PRD v8 S8-R4:** "S8-R4: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file."

#### SBR S14-R5: Summary PDF columns (no Sales Type) (ADD)

> **SBR v28 S14-R5:** "S14-R5: Summary PDF — one rolled-up row per rep, in the report's currently-active order (S14-R2a), with an "(Inactive)" tag on toggled-off contributors (S5-R9). Columns: Rep / Labor Delta / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Shop Supplies / Adjustments / Margin / Margin % / Subtotal. Subtotal bolded across header, body, and the grand totals row; Labor Delta colored. The grand totals row reads "Totals" in the Rep cell and shows, for each metric column, the grand aggregate across all summary rows in the document — rep rows plus the Unassigned row when Show Unassigned is on (money and Labor Delta summed from unrounded values; Margin % recomputed as total Margin ÷ total Margin base, "—" when ≤ 0)."

Note: Answers baseline Q3: Summary PDF unchanged, one row per rep, no Sales Type column.

#### SBR S14-R6: Expanded PDF includes Sales Type after Status (CONFIRM)

> **SBR v28 S14-R6:** "S14-R6: Expanded View PDF — one page-block per rep, in the currently-active order (S14-R2a), page break before each new rep after the first, each with the header strip (which already includes the selected date range per S14-R3), the rep's name, and a per-invoice table: Date / Invoice / Customer / Status / Sales Type / Labor Delta / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Shop Supplies / Adjustments / Margin / Margin % / Subtotal. Each block ends with a per-rep totals row ("Totals" in the Date cell; Invoice/Customer/Status blank; each metric column aggregated as in S14-R5, Margin % recomputed). There is no grand-totals row across all reps."

> **PRD v8 S5-R23:** "S5-R23: The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF."

Note: SBR does not say that the side a row is not credited with shows a dash in the PDF (PRD S5-R23), or what the per-rep Totals row shows in the Sales Type cell.

#### SBR S14-R15: Summary CSV headers (no Sales Type) (ADD)

> **SBR v28 S14-R15:** "S14-R15: Summary CSV — file sales-by-representative-summary.csv, UTF-8 BOM, one header row + one row per rep in the current filtered view, in the currently-active order (S14-R2a). Headers, in order: Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. Generated server-side against the current filters and active sort (S14-R2a)."

Note: Answers baseline Q3.

#### SBR S14-R16: Expanded CSV headers include Sales Type (CONFIRM)

> **SBR v28 S14-R16:** "S14-R16: Expanded CSV — file sales-by-representative-expanded.csv, UTF-8 BOM, one header row + one row per invoice flattened across all reps in the currently-active order (S14-R2a), for the current filtered view. Headers, in order: Representative, Date, Invoice #, Customer, Status, Sales Type, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. Generated server-side against the current filters and active sort (S14-R2a). (Build note: the current build populates a single mislabeled hours column here; align it to these three hours columns to match the Summary CSV and the screen.)"

> **PRD v8 S5-R23:** "S5-R23: The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF."

Note: SBR does not say that the cells of the side a row is not credited with are blank (PRD S5-R23). S14-R17 says only that numeric columns are plain numbers.

#### SBR S14-R18: # Invoices same as on-screen (N) (CONFIRM)

> **SBR v28 S14-R18:** "S14-R18: # Invoices = the count of the rep's matching invoices in the current filtered view (same as the on-screen (N)). # Customers = the count of distinct customers across those matching invoices (de-duplicated across locations when several are selected)."

> **PRD v8 S5-R13:** "S5-R13: A representative counts an invoice once, even when they have two rows for it. When two people split an invoice, each counts it once, so the representatives' invoice counts can add up to more than the shop's."

#### SBR S14-R19: Unassigned row in exports (ADD)

> **SBR v28 S14-R19:** "S14-R19: Unassigned row in exports. When Show Unassigned is on, the Unassigned row is emitted in all four downloads exactly as it appears on screen: in the Summary PDF and Summary CSV as one rolled-up row whose Rep / Sales Rep cell reads the literal "Unassigned" (sorted to the top per S22-R4); in the Expanded CSV, its invoices carry Sales Rep = "Unassigned"; in the Expanded View PDF as its own top page-block titled "Unassigned". The Summary PDF grand-totals row aggregates across all summary rows including Unassigned (S14-R5); in the Summary CSV, the Unassigned row is simply one of the data rows (the CSV has no totals row, S14-R15). When Show Unassigned is off, no Unassigned row or unassigned invoices appear in any export."

> **PRD v8 S5-R18:** "S5-R18: A side with no representative is credited to Unassigned, which shows when Show Unassigned is on, as today."

#### SBR S14-R20: Location column position in exports (ADD)

> **SBR v28 S14-R20:** "S14-R20: Location in exports. Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen — Summary and Expanded, PDF and CSV: a Summary (rolled-up) row carries the rep's location, reading Multiple when that rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact location. In addition, every export (each PDF and each CSV, Summary and Expanded) includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected — matching the on-screen scope. In a PDF the "Locations:" line appears in the header strip; in a CSV it appears as a leading metadata line above the column-header row. In the shorter Summary download, which has no Date or Status column, the Location column appears immediately after the Representative name."

Note: Location takes "the same position it occupies on screen", which is itself unclear (see S18-R13, baseline Q4).

#### SBR S14-R20a: CSV filter lines include Sales Type (CONFIRM)

> **SBR v28 S14-R20a:** "S14-R20a: The CSV carries the same filter-summary lines as the PDF header, verbatim and in the same order: every filter the PDF header names (the date range, the "Locations:" line, and any report-specific filter lines — including the Sales Type and payment-status filter lines) appears as a leading metadata line in the CSV, above the column-header row. A CSV saved or forwarded later is never ambiguous about which filters produced it. (Suite-wide rule, 2026-08-12.)"

> **PRD v8 S8-R4:** "S8-R4: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file."

#### SBR S14-E3: Empty-data export still generates (DIVERGE)

> **SBR v28 S14-E3:** "S14-E3: Empty-data export still generates. Triggering any of the four downloads against a filter set with zero matching invoices produces a file, not an error (S14-N2 applies only to a genuine load failure where no result returned, not to an empty-but-loaded result). The Summary PDF renders the header strip, no data rows, and a grand-totals row showing zeros for the money and Labor Delta columns and "—" for Margin % (Margin base ≤ 0, per §3). The Expanded View PDF (no grand-totals row, S14-R6) renders just the header strip with no per-rep blocks. Both report CSVs generate a header-row-only file (with the UTF-8 BOM). No special "empty" treatment."

> **PRD v8 S8-R4:** "S8-R4: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file."

Note: Unchanged since v24. For the "no Sales Type selected" case the PRD makes no file and shows "Empty export". For other empty results the PRD says nothing, so S14-E3 still applies to them.

#### SBR S15-R1: Export name "Sales Rep Assignments" (DIVERGE)

> **SBR v28 S15-R1:** "S15-R1: The dialog's Report Name dropdown includes "Sales Rep Assignments," appended at the bottom of the list (additive)."

> **PRD v8 S4-R23:** "S4-R23: The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales"."

Note: Unchanged. The PRD calls it the "Sales Representative Assignments export". Baseline Q7.

#### SBR S15-R2: Dialog note: active and inactive reps listed (DIVERGE)

> **SBR v28 S15-R2:** "S15-R2: Selecting it hides the date range picker and shows the note: "Snapshot of current sales rep assignments. Both active and inactive reps with assignments are listed.""

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Unchanged. Under S4-R20 a deactivated account no longer holds any customer field. Baseline Q1.

#### SBR S15-R3: File name sales-rep-assignments.csv (ADD)

> **SBR v28 S15-R3:** "S15-R3: The Export action downloads sales-rep-assignments.csv and shows a success toast (§7)."

Note: Unchanged; the PRD gives no file name. Baseline Q7.

#### SBR S15-R4: Headings: Customer Name, Sales Rep, Rep is active?, Side (DIVERGE)

> **SBR v28 S15-R4:** "S15-R4: The CSV has a header row + one row per customer per assigned person. Headers, in order: Customer Name, Sales Rep, Rep is active?, Side. UTF-8 BOM prepended."

> **PRD v8 S4-R23:** "S4-R23: The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales"."

Note: SBR keeps "Rep is active?" and puts "Side" after it. The PRD says Side comes after "Representative is active?". Baseline Q7: SBR v28 answers option B, and the PRD wording differs.

#### SBR S15-R5: One row per person; Side values (DIVERGE)

> **SBR v28 S15-R5:** "S15-R5: Every customer in the organization with an assigned sales rep produces one row per person assigned to it. A customer that is not split produces one row with Side = "Parts and Service". On a split customer, each person produces one row whose Side lists every field they hold, in the customer window's order and separated by ", ": "Service Labor", "Service Parts", "Part Sales"; "Part Sales" is listed only when the person was picked for it (the Splitting Sales Representatives PRD (epic SV-10890), S4-R23)."

> **PRD v8 S4-R23:** "S4-R23: The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales"."

Note: (1) SBR: a customer that is not split "produces one row with Side = 'Parts and Service'". PRD: a person in an added Part Sales field is listed "split or not", and one person in several fields gets one row such as "Parts and Service, Part Sales". (2) SBR: "Part Sales" only "when the person was picked for it". PRD: "for the person in an added Part Sales field".

#### SBR S15-R6: "Rep is active?" = staff active status (DIVERGE)

> **SBR v28 S15-R6:** "S15-R6: Rep is active? = Yes when the rep's staff record is currently active; No when the staff record is inactive (e.g., deactivated via Story 13) or has been deleted while the customer still references it. This column reflects the staff member's active status — a distinct flag from the sales-rep toggle that drives the report's "(Inactive)" marker (S5-R9). The two can differ (a rep can be staff-active but toggle-off, or toggle-on but staff-inactive); this column tracks staff-active status only."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: Unchanged. Under S4-R20 a deactivated person is removed, so "No" can only come from a deleted record (S15-R8).

#### SBR S15-R7: Sort: customer A to Z, then rep A to Z (ADD)

> **SBR v28 S15-R7:** "S15-R7: Rows are sorted by customer name A→Z (primary), then rep name A→Z (secondary)."

Note: Unchanged; with several rows per customer the secondary sort now matters.

#### SBR S15-R9: Name drift: "still one row per customer" (DIVERGE)

> **SBR v28 S15-R9:** "S15-R9: When the denormalized rep-name snapshot differs across customers for the same underlying rep (name drift over time), the export uses each customer's own stored snapshot in that customer's row; drift never adds extra rows for a customer (still one row per customer, S15-R5) and never overwrites one customer's snapshot with another's."

> **SBR v28 S15-R5:** "S15-R5: Every customer in the organization with an assigned sales rep produces one row per person assigned to it. A customer that is not split produces one row with Side = "Parts and Service". On a split customer, each person produces one row whose Side lists every field they hold, in the customer window's order and separated by ", ": "Service Labor", "Service Parts", "Part Sales"; "Part Sales" is listed only when the person was picked for it (the Splitting Sales Representatives PRD (epic SV-10890), S4-R23)."

> **PRD v8 S4-R23:** "S4-R23: The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales"."

Note: Unchanged since v24. It conflicts with the new S15-R5 in the same spec (one row per customer per person).

#### SBR S15-R10: Customers with no rep are not listed (ADD)

> **SBR v28 S15-R10:** "S15-R10: Customers with no assigned rep are not included."

#### SBR S17-R1: Mobile: Sales Type control operable on touch (ADD)

> **SBR v28 S17-R1:** "S17-R1: All toolbar controls (â‹¯ exports, column selector, Show Unassigned toggle, date range picker, Sales Type, Invoice Status, Location) are visible and operable on touch."

#### SBR S18-R7.2: Toolbar order: Sales Type between Date Range and Invoice Status (ADD)

> **SBR v28 S18-R7.2:** "S18-R7.2: Toolbar surface white (light) / dark (dark); toolbar contents padded per S18-R1. Toolbar control order, left to right within the action cluster: â‹¯ exports, Column Selection, Show Unassigned, Date Range, Sales Type, Invoice Status, Location."

#### SBR S18-R13: Location column right after Status (DIVERGE)

> **SBR v28 S18-R13:** "S18-R13: When shown (S21-R7), the Location column appears at the end of the leading identifier group — immediately after the Status column and before the first metric column (Labor Delta) — on every rep summary row and invoice detail row, matching the Location column's placement across the reports suite; it never displaces the pinned Subtotal column, which stays rightmost (S10-R1). The toolbar's Location filter control keeps a constant width regardless of the selected label (a single location name, several names, or "All Locations"), so the toolbar layout does not shift as the selection changes."

> **SBR v28 S5-R2:** "S5-R2: The columns appear left-to-right: Date, Invoice, Customer, Status, Sales Type, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. (15 columns: five leading identifier columns, nine metric columns, and Subtotal.) Sales Type is filled on invoice detail rows only and reads "Labor", "Parts", "Part Sales" or "Labor, Parts" (the Splitting Sales Representatives PRD (epic SV-10890), S5-R19). It is off by default on screen and can be turned on from the column selector (Story 20); while it is off, the columns that follow sit one place to the left."

> **PRD v8 S5-R19:** "S5-R19: An invoice row carries a "Sales Type" column, after Status, reading "Labor", "Parts", "Part Sales" or "Labor, Parts"."

Note: Unchanged since v24. S5-R2 (v28) and PRD S5-R19 put Sales Type right after Status. S18-R13 puts Location "immediately after the Status column" and "at the end of the leading identifier group", which now includes Sales Type. Baseline Q4 is still open.

#### SBR S19-R1: Field on standard work order (splittable); part sale single; read-only in History (CONFIRM)

> **SBR v28 S19-R1:** "S19-R1: The left panel of a standard Work Order includes a Sales Representative field, which can be split into "Sales Representative - Labor" and "Sales Representative - Parts" (the Splitting Sales Representatives PRD (epic SV-10890), Stories 1 and 2). A Part Sale WO keeps a single Sales Representative field whose one rep holds both sides. The field is hidden on imported Work Orders and read-only in History mode."

> **PRD v8 S2-R17:** "S2-R17: Once the work order is invoiced or paid, or when it is opened from its history, each field is plain text with the same label and wording, with no + or remove x. A work order with both fields shows both labels with their names."

> **PRD v8 S2-N2:** "S2-N2: A part sale's card has no + button. A part sale keeps one Sales Representative field."

> **PRD v8 S1-N1:** "S1-N1: A user without 'Work Orders — Create & Edit', or a work order that is invoiced, paid or opened from its history, shows the field as plain text with the same label and wording, with no + or remove x. If a change is sent by any other route, the system refuses it."

Note: Answers baseline Q8: read-only in History mode (v24 said hidden).

#### SBR S19-R2: Only reps with the toggle on are offered (CONFIRM)

> **SBR v28 S19-R2:** "S19-R2: The selector offers reps whose sales-rep toggle is currently on. Reps whose toggle is off are not offered as new selections."

> **PRD v8 S1-R8:** "S1-R8: Clicking the field opens a dropdown. Its first option is "Unassigned", followed by every active sales representative, sorted by first name, then last name, A to Z."

> **PRD v8 S1-N2:** "S1-N2: A staff member whose Sales Representative switch is off is not listed and cannot be picked. If one is sent by any other route, the system refuses it with "The selected staff member is not a sales representative.""

Note: The PRD also requires an active account (S4-R3, S4-R27).

#### SBR S19-R3: New work order opens Unassigned (DIVERGE)

> **SBR v28 S19-R3:** "S19-R3: A new Work Order or Part Sale WO opens with the Sales Rep field unassigned; the user assigns it explicitly. (The report still credits correctly when the WO is left unassigned — S19-R6 — so pre-filling at creation is not required.)"

> **PRD v8 S4-R24:** "S4-R24: A new work order for a customer that is not split starts with the customer's representative in its one Sales Representative field. The work order is not split."

> **PRD v8 S4-R25:** "S4-R25: A new work order for a split customer starts with the Labor and Parts fields: "Sales Representative - Labor" holds the customer's Service Labor person and "Sales Representative - Parts" holds the customer's Service Parts person. Removing its Parts field works as S2-R16."

> **PRD v8 S4-R26:** "S4-R26: A new part sale starts with the customer's Part Sales field when it is added: the person picked, or "Unassigned" when "Unassigned" was picked. Without a Part Sales field it starts with the Service Parts person, or the one representative when the customer is not split."

Note: Unchanged since v24. The PRD now fills a new work order or part sale with the customer's representatives.

#### SBR S19-R4: Save on change (CONFIRM)

> **SBR v28 S19-R4:** "S19-R4: Changing the Sales Rep persists immediately, with no separate Save step (save-on-change)."

> **PRD v8 S1-R14:** "S1-R14: Each change is saved as it is made. There is no Save button."

#### SBR S19-R5: Read-only when Invoiced or Paid (CONFIRM)

> **SBR v28 S19-R5:** "S19-R5: The selector is read-only (non-interactive) when the WO status is "Invoiced" or "Paid"."

> **PRD v8 S2-R17:** "S2-R17: Once the work order is invoiced or paid, or when it is opened from its history, each field is plain text with the same label and wording, with no + or remove x. A work order with both fields shows both labels with their names."

> **PRD v8 S2-E4:** "S2-E4: Changing a representative after the work order is invoiced or paid is not offered. A change sent by any other route is refused with "The sales representative cannot be changed on an invoiced or paid work order." The invoice keeps the names captured when it was created (Story 5). Reversing the invoice unlocks the field again, and the next invoice captures the names afresh."

#### SBR S19-R6: Both sides captured at invoicing; customer fallback per side (CONFIRM)

> **SBR v28 S19-R6:** "S19-R6: At invoice creation, the Work Order's parts and service representatives are captured onto the resulting invoice, and that capture is what the report reads. When the Work Order has nobody on either side, each side takes the customer's representative for that side (a part sale takes the customer's Part Sales choice for the whole sale, the Splitting Sales Representatives PRD (epic SV-10890), S4-R18); when that is also absent, the side is unassigned and its share appears under the Unassigned row (Story 22)."

> **PRD v8 S4-R17:** "S4-R17: A work order invoiced with nobody on either side is credited with the customer's Service Parts person on the parts side and the Service Labor person on the labor side. A customer that is not split gives its one person both sides."

> **PRD v8 S4-R18:** "S4-R18: A part sale invoiced with no representative is credited, for the whole sale, to the person new part sales get from the customer (S4-R26), or to nobody when the Part Sales field reads "Unassigned"."

> **PRD v8 S5-R1:** "S5-R1: When a work order is invoiced, the parts representative and the labor representative in effect are both captured on the invoice, by name."

> **PRD v8 S5-R18:** "S5-R18: A side with no representative is credited to Unassigned, which shows when Show Unassigned is on, as today."

#### SBR S19-R7: Customer sidebar labels (CONFIRM)

> **SBR v28 S19-R7:** "S19-R7: The customer record's left-panel sidebar shows the customer's sales representatives with the customer window's labels: one "Sales Representative" row, or "Sales Representative - Service Labor", "- Service Parts" and "- Part Sales" when split; an empty one reads "Unassigned" (the Splitting Sales Representatives PRD (epic SV-10890), S4-R19)."

> **PRD v8 S4-R19:** "S4-R19: The customer page shows the representatives with the window's labels, in the window's order: "Sales Representative" or "Sales Representative - Service Labor", then "Sales Representative - Service Parts" when added, then "Sales Representative - Part Sales" when added. An empty one reads "Unassigned". The Sales Representative rows show on every customer, whether or not the customer has an address. The other fields on the page keep today's rule of showing only when the customer has an address."

#### SBR S19-R8: Accessible name "Sales Rep" (ADD)

> **SBR v28 S19-R8:** "S19-R8: The selector carries an accessible name "Sales Rep"."

Note: Unchanged. It does not say what the accessible name is for each of the Labor and Parts fields. A small point for the PO, if wanted.

#### SBR S19-E1: Inactive person shown in the field (CONFIRM)

> **SBR v28 S19-E1:** "S19-E1: If a rep bound to a Work Order has since had their toggle turned off, the field marks them inactive in the wording of the Splitting Sales Representatives PRD (epic SV-10890), S1-E2, so the current assignment is visible; that rep is not offered as a new selection."

> **PRD v8 S1-E2:** "S1-E2: A person whose Sales Representative switch was turned off, or whose staff account was deactivated, stays in the field until someone changes it. The field reads their name followed by "(Inactive)", for example "Elliot Brennan (Inactive)". They are not offered in the dropdown, so no option is checked while they hold the field."

#### SBR S19-N2: Changing the work order does not alter past invoices (CONFIRM)

> **SBR v28 S19-N2:** "S19-N2: Changing a WO's Sales Rep does not retroactively alter invoices already created from it."

> **PRD v8 S5-R2:** "S5-R2: The names captured on the invoice do not change afterwards, including when a staff member is renamed or deactivated. That is what the invoice stores. The report labels each person with their current name, as it does today, so a renamed representative stays one row; it shows the captured name only when the staff record no longer exists."

#### SBR S20-R2: Toggleable list starts with Sales Type (CONFIRM)

> **SBR v28 S20-R2:** "S20-R2: The toggleable columns are, in this order: Sales Type, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %."

> **PRD v8 S5-R20:** "S5-R20: The Sales Type column is offered in the report's column selector, first in its list."

#### SBR S20-R6: First visit: Sales Type off (CONFIRM)

> **SBR v28 S20-R6:** "S20-R6: On first visit (no remembered preference), all nine metric columns are visible and Sales Type is not."

> **PRD v8 S5-R21:** "S5-R21: The Sales Type column is off by default on screen, for every user."

#### SBR S20-R6a: Sales Type off for users with saved choices; stays on once turned on (DIVERGE)

> **SBR v28 S20-R6a:** "S20-R6a: Sales Type is off by default for every user, including users who saved their column choices before the release that adds it. A user who turns it on keeps it on for later visits."

> **PRD v8 line 69:** "Each user's saved column choices and sort on Sales By Representative reset once to the defaults. A saved link that narrowed Sales By Representative by Product Type opens with every Sales Type selected."

> **PRD v8 S5-R22:** "S5-R22: A user who turns the Sales Type column on keeps it on for later visits."

Note: SBR forces only Sales Type off and keeps the user's other saved column choices and sort. PRD Release day: "Each user's saved column choices and sort ... reset once to the defaults."

#### SBR S20-R8: Exports always include Sales Type in the Expanded versions (CONFIRM)

> **SBR v28 S20-R8:** "S20-R8: The column selector state does not affect any export; all four downloads always include all metric columns, and both Expanded downloads always include Sales Type, whether or not it is shown on screen."

> **PRD v8 S5-R23:** "S5-R23: The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF."

#### SBR S22-R2: Show Unassigned off: an unassigned side counts nowhere (CONFIRM)

> **SBR v28 S22-R2:** "S22-R2: When off, an invoice side with no representative contributes to nothing: no row, not counted in any total."

> **PRD v8 S5-R14:** "S5-R14: With Show Unassigned on, the report's totals are the same whether invoices are split or not. With it off, a side credited to Unassigned is left out of the totals, as Unassigned money is today."

> **PRD v8 S5-R18:** "S5-R18: A side with no representative is credited to Unassigned, which shows when Show Unassigned is on, as today."

#### SBR S22-R3: Unassigned row rolls up unassigned sides (CONFIRM)

> **SBR v28 S22-R3:** "S22-R3: When on, a single "Unassigned" summary row rolls up every matching invoice side (respecting all other active filters) that has no representative: the whole invoice when nobody is credited, or one side of it when the other side has a representative. The label is "Unassigned" verbatim."

> **PRD v8 S5-R18:** "S5-R18: A side with no representative is credited to Unassigned, which shows when Show Unassigned is on, as today."

#### SBR S22-R4: Unassigned pinned to the top (ADD)

> **SBR v28 S22-R4:** "S22-R4: The Unassigned row is pinned to the top of the table, above the A→Z reps, and stays pinned regardless of sort (S11-R2)."

Note: Unchanged; a "must not change" item.

#### SBR S22-R5: Unassigned row behaves like a rep row; never "(Inactive)" (ADD)

> **SBR v28 S22-R5:** "S22-R5: The Unassigned row behaves like any rep summary row: same metric columns, the (N) count, expandable (S6-R1) to its contributing invoices, and included in the grand Totals indicator. It never carries an "(Inactive)" tag."

#### SBR S23-R1: Remembered per browser, including sales type (CONFIRM)

> **SBR v28 S23-R1:** "S23-R1: The report remembers, per browser, the user's filter and view settings: date range (incl. custom start/end), sales type, invoice status, location, Show Unassigned, column visibility, and the active column sort (column + direction). On the next visit — including after leaving and returning, or a page reload — these are restored before the first data fetch."

> **PRD v8 S5-R22:** "S5-R22: A user who turns the Sales Type column on keeps it on for later visits."

Note: Answers tech-plan Q10: per browser.

#### SBR S23-R3: Invalid remembered value falls back to the default (ADD)

> **SBR v28 S23-R3:** "S23-R3: Restoration is defensive: a remembered value that is no longer valid (a location the user can no longer access, a range or sort column that no longer exists, a hidden-but-sorted column) falls back to that setting's default rather than being sent to the server. A stale saved setting can never cause an error or an invalid request."

> **PRD v8 line 69:** "Each user's saved column choices and sort on Sales By Representative reset once to the defaults. A saved link that narrowed Sales By Representative by Product Type opens with every Sales Type selected."

Note: This agrees with the PRD Release-day rule that an old Product Type selection opens with every Sales Type selected. The PRD talks of a saved link; SBR remembers in the browser and never mentions links.

#### SBR S23-R4: First-visit defaults include Sales Type all and column off (CONFIRM)

> **SBR v28 S23-R4:** "S23-R4: With no saved settings (first visit): date range This Month (S2-R7), Sales Type with all three options selected, reading "All" (S3-R3), Invoice Status "All Statuses" (S4-R3), Location = active location (S21-R2), Show Unassigned off (S22-R1), all nine metric columns visible and Sales Type off (S20-R6), sort = A→Z default (S11-R4)."

> **PRD v8 S8-R1:** "S8-R1: Sales By Representative has a "Sales Type" filter with three options, in this order: "Labor", "Parts", "Part Sales". All three are selected by default."

> **PRD v8 S5-R21:** "S5-R21: The Sales Type column is off by default on screen, for every user."

### b2. Sales By Customer v21

| # | Ref | Topic | Verdict | Against | Same as old copy? |
|---|---|---|---|---|---|
| 1 | line 15 | Overview: filter by sales type (Part Sales, Service Sales) | **CONFIRM** | PRD S8-R6, PRD S8-R7 | no (changed) |
| 2 | line 23 | Out of scope: whole invoice classified by prefix | **CONFIRM** | PRD S8-R10 | yes |
| 3 | line 61 | Terminology: Service invoice | **CONFIRM** | PRD S8-R10 | yes |
| 4 | line 62 | Terminology: Parts invoice | **CONFIRM** | PRD S8-R10 | yes |
| 5 | S3-R1 | Filter labeled "Sales Type", multi-select | **CONFIRM** | PRD S8-R6 | no (changed) |
| 6 | S3-R2 | Menu: two options, "Select all" row, "Clear selection" at the bottom | **ADD** | PRD S8-R7 | no (changed) |
| 7 | S3-R3 | Both selected on first load | **ADD** | - | no (changed) |
| 8 | S3-R4 | Both selected: "Sales Type: All Sales" | **CONFIRM** | PRD S8-R8 | no (changed) |
| 9 | S3-R5 | Service Sales only: S invoices; label | **CONFIRM** | PRD S8-R8, PRD S8-R10 | no (changed) |
| 10 | S3-R6 | Part Sales only: P invoices; label | **CONFIRM** | PRD S8-R8, PRD S8-R10 | no (changed) |
| 11 | S3-R6a | None selected: "Sales Type: No sales", empty state | **CONFIRM** | PRD S8-R8 | no (changed) |
| 12 | S3-R7 | Export filter line values, including "No sales" | **DIVERGE** | PRD S8-R9 | no (changed) |
| 13 | S3-R8 | Sales Type remembered between visits | **CONFIRM** | PRD S8-E1 | no (changed) |
| 14 | S3-N1 | No matching invoices: empty state | **ADD** | - | yes |
| 15 | line 120 | Context note: renamed, only the words changed | **CONFIRM** | PRD S8-N1, PRD S8-R10 | no (changed) |
| 16 | S6-R2 | Saved view includes Sales Type | **ADD** | - | no (changed) |
| 17 | S7-R5 | Invoice count follows Sales Type | **CONFIRM** | PRD S8-N1 | no (changed) |
| 18 | S7-R17 | Adjustments (unchanged) | **CONFIRM** | PRD S8-N1 | yes |
| 19 | S7-N2 | Reversed or voided excluded with both options selected | **ADD** | - | no (changed) |
| 20 | S8-R20 | Changing Sales Type collapses expanded rows | **ADD** | - | no (changed) |
| 21 | S9-R3 | Sales Type written to the page link before opening an invoice | **ADD** | - | no (changed) |
| 22 | S14-R3 | CSVs follow Sales Type | **CONFIRM** | PRD S8-R9 | no (changed) |
| 23 | S14-R4 | Summary CSV columns (no Sales Type column) | **CONFIRM** | PRD S8-N1 | yes |
| 24 | S14-R13a | CSV carries the "Sales Type: {value}" line | **CONFIRM** | PRD S8-R9 | no (changed) |
| 25 | S15-R10 | PDF header Sales Type values, including "No sales" | **DIVERGE** | PRD S8-R9 | no (changed) |
| 26 | S18-R10 | Export with no matching customers still downloads | **DIVERGE** | PRD S8-R9 | yes |
| 27 | S18-R1 | Customer filter sits between Sales Type and Location | **ADD** | - | no (changed) |
| 28 | S18-R2 | Customer type-ahead scoped to Sales Type | **ADD** | - | no (changed) |
| 29 | S21-R1 | Mobile: Sales Type works on touch | **ADD** | - | no (changed) |

#### SBC line 15: Overview: filter by sales type (Part Sales, Service Sales) (CONFIRM)

> **SBC v21 line 15:** "The user can filter by date range, by sales type (Part Sales, Service Sales, or both), by customer (a multi-select filter with search-as-you-type, all customers selected by default), and by location (one, several, or all of the locations the user has access to). The Customer filter is how the user narrows the table to a specific customer."

> **PRD v8 S8-R6:** "S8-R6: On Sales By Customer, the filter labeled "Product Type" today is labeled "Sales Type"."

> **PRD v8 S8-R7:** "S8-R7: Its two options read "Part Sales" and "Service Sales"."

#### SBC line 23: Out of scope: whole invoice classified by prefix (CONFIRM)

> **SBC v21 line 23:** "Per-line-item classification within a single invoice. The report classifies a whole invoice as Service or Parts by its invoice-number prefix."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC line 61: Terminology: Service invoice (CONFIRM)

> **SBC v21 line 61:** "Service invoice — An invoice whose number starts with S."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC line 62: Terminology: Parts invoice (CONFIRM)

> **SBC v21 line 62:** "Parts invoice — An invoice whose number starts with P."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC S3-R1: Filter labeled "Sales Type", multi-select (CONFIRM)

> **SBC v21 S3-R1:** "S3-R1: A "Sales Type" filter is visible in the report toolbar. It is a multi-select, matching the behavior of the Customer and Location filters."

> **PRD v8 S8-R6:** "S8-R6: On Sales By Customer, the filter labeled "Product Type" today is labeled "Sales Type"."

#### SBC S3-R2: Menu: two options, "Select all" row, "Clear selection" at the bottom (ADD)

> **SBC v21 S3-R2:** "S3-R2: Its menu offers two options, each with a checkbox, "Part Sales" and "Service Sales", under a "Select all" row, with "Clear selection" at the bottom."

> **PRD v8 S8-R7:** "S8-R7: Its two options read "Part Sales" and "Service Sales"."

Note: Answers baseline Q6. The option names agree with the PRD; the PRD says nothing about the rows.

#### SBC S3-R3: Both selected on first load (ADD)

> **SBC v21 S3-R3:** "S3-R3: Both options are selected on first load."

#### SBC S3-R4: Both selected: "Sales Type: All Sales" (CONFIRM)

> **SBC v21 S3-R4:** "S3-R4: When both options are selected, no sales-type filter is applied, and the filter reads "Sales Type: All Sales"."

> **PRD v8 S8-R8:** "S8-R8: With both options selected, the filter reads "Sales Type: All Sales". With one, it reads that option's name, for example "Sales Type: Part Sales". With none, it reads "Sales Type: No sales"."

#### SBC S3-R5: Service Sales only: S invoices; label (CONFIRM)

> **SBC v21 S3-R5:** "S3-R5: When only "Service Sales" is selected, the report includes only invoices whose number starts with S, and the filter reads "Sales Type: Service Sales"."

> **PRD v8 S8-R8:** "S8-R8: With both options selected, the filter reads "Sales Type: All Sales". With one, it reads that option's name, for example "Sales Type: Part Sales". With none, it reads "Sales Type: No sales"."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC S3-R6: Part Sales only: P invoices; label (CONFIRM)

> **SBC v21 S3-R6:** "S3-R6: When only "Part Sales" is selected, the report includes only invoices whose number starts with P, and the filter reads "Sales Type: Part Sales"."

> **PRD v8 S8-R8:** "S8-R8: With both options selected, the filter reads "Sales Type: All Sales". With one, it reads that option's name, for example "Sales Type: Part Sales". With none, it reads "Sales Type: No sales"."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC S3-R6a: None selected: "Sales Type: No sales", empty state (CONFIRM)

> **SBC v21 S3-R6a:** "S3-R6a: When neither option is selected (after "Clear selection"), the filter reads "Sales Type: No sales" and the report shows the empty-state message (Story 17) until an option is selected."

> **PRD v8 S8-R8:** "S8-R8: With both options selected, the filter reads "Sales Type: All Sales". With one, it reads that option's name, for example "Sales Type: Part Sales". With none, it reads "Sales Type: No sales"."

Note: Adds the empty state, which the PRD does not mention for SBC.

#### SBC S3-R7: Export filter line values, including "No sales" (DIVERGE)

> **SBC v21 S3-R7:** "S3-R7: The exports' filter summary line reads "Sales Type: All Sales", "Sales Type: Part Sales only", "Sales Type: Service Sales only" or "Sales Type: No sales", matching the selection, in the CSV and the PDF."

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

Note: SBC lists a "Sales Type: No sales" export line, so a file is made. PRD S8-R9: with no option selected, Export shows "Empty export" and makes no file.

#### SBC S3-R8: Sales Type remembered between visits (CONFIRM)

> **SBC v21 S3-R8:** "S3-R8: The Sales Type selection is remembered between visits (Story 6)."

> **PRD v8 S8-E1:** "S8-E1: A Sales By Customer filter choice remembered from before the release opens with the same options selected, under the new names."

Note: Relevant to baseline Q9: SBC v21 still describes a browser-saved view (Story 6).

#### SBC S3-N1: No matching invoices: empty state (ADD)

> **SBC v21 S3-N1:** "S3-N1: If the selection produces no matching invoices, the table shows the empty-state message (see Story 17)."

#### SBC line 120: Context note: renamed, only the words changed (CONFIRM)

> **SBC v21 line 120:** "* Context note: renamed on 2026-10-06 from "Product Type" with options "Parts" and "Services" (the Splitting Sales Representatives PRD (epic SV-10890), Story 8). Only the words changed. A service invoice carries parts too, so "Parts" read like parts dollars; the options always separated part sales from service work orders."

> **PRD v8 S8-N1:** "S8-N1: No Sales By Customer figure, row or count changes because of the new wording."

> **PRD v8 S8-R10:** "S8-R10: What each option includes does not change. "Part Sales" are invoices from part sales. "Service Sales" are invoices from service work orders, including the parts sold on them."

#### SBC S6-R2: Saved view includes Sales Type (ADD)

> **SBC v21 S6-R2:** "S6-R2: The saved view includes: the date range, the Sales Type, the location selection, the Customer filter selection, the sort column and direction, and the visible columns."

#### SBC S7-R5: Invoice count follows Sales Type (CONFIRM)

> **SBC v21 S7-R5:** "S7-R5: The count reflects the active date range, Sales Type, and location; it is not a lifetime count."

> **PRD v8 S8-N1:** "S8-N1: No Sales By Customer figure, row or count changes because of the new wording."

#### SBC S7-R17: Adjustments (unchanged) (CONFIRM)

> **SBC v21 S7-R17:** "S7-R17: Adjustments is the signed net of invoice-level fees and discounts across the row's invoices: fees count positive, discounts count negative. A line-level fee or discount stays folded into its own line's Labor or Parts value; an invoice-level amount is never allocated into the Labor or Parts columns."

> **PRD v8 S8-N1:** "S8-N1: No Sales By Customer figure, row or count changes because of the new wording."

Note: No SBC figure changes.

#### SBC S7-N2: Reversed or voided excluded with both options selected (ADD)

> **SBC v21 S7-N2:** "S7-N2: A reversed or voided invoice never appears as an invoice row and never adds to any count or total, even with both Sales Type options selected."

#### SBC S8-R20: Changing Sales Type collapses expanded rows (ADD)

> **SBC v21 S8-R20:** "S8-R20: Any change that re-fetches customer rows from the server — the date range, Sales Type, location, the Customer filter, or the sort — collapses all expanded rows."

#### SBC S9-R3: Sales Type written to the page link before opening an invoice (ADD)

> **SBC v21 S9-R3:** "S9-R3: Before navigating, the active date range and Sales Type are written to the page link so the report can be restored."

Note: Relevant to baseline Q9 (links).

#### SBC S14-R3: CSVs follow Sales Type (CONFIRM)

> **SBC v21 S14-R3:** "S14-R3: Both CSVs are generated on the server from the active date range, Sales Type, location, Customer filter (Story 18), and sort, and contain the customers matching those filters (S18-R7)."

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

#### SBC S14-R4: Summary CSV columns (no Sales Type column) (CONFIRM)

> **SBC v21 S14-R4:** "S14-R4 (Summary contents): The Summary CSV has one row per customer and no asset or invoice rows. Its columns, in this exact order, are: Customer, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal."

> **PRD v8 S8-N1:** "S8-N1: No Sales By Customer figure, row or count changes because of the new wording."

#### SBC S14-R13a: CSV carries the "Sales Type: {value}" line (CONFIRM)

> **SBC v21 S14-R13a:** "S14-R13a: The CSV carries the same filter-summary lines as the PDF header, verbatim and in the same order: every filter the PDF header names (the date range, the "Locations:" line, and any report-specific filter lines — in particular the "Sales Type: {value}" line the PDF header already carries (S15-R10)) appears as a leading metadata line in the CSV, above the column-header row. A CSV saved or forwarded later is never ambiguous about which filters produced it. (Suite-wide rule, 2026-08-12.)"

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

#### SBC S15-R10: PDF header Sales Type values, including "No sales" (DIVERGE)

> **SBC v21 S15-R10:** "S15-R10: The header text block shows, in order: the report title "Sales By Customer Report"; the organization name; the date range; the filter summary line "Sales Type: {value}" where value is "All Sales", "Part Sales only", "Service Sales only" or "No sales"; and the location line "Locations: {value}" (S15-R14)."

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

Note: Same conflict as S3-R7.

#### SBC S18-R10: Export with no matching customers still downloads (DIVERGE)

> **SBC v21 S18-R10:** "S18-R10: If an export (CSV or PDF) is triggered while the active filters match no customers — for example, no customer is selected — the export still downloads, containing the column headers and a totals row of zeros, with no data rows and no warning."

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

Note: Unchanged since v20. For "no Sales Type selected" the PRD makes no file and shows "Empty export".

#### SBC S18-R1: Customer filter sits between Sales Type and Location (ADD)

> **SBC v21 S18-R1:** "S18-R1: The toolbar has a Customer filter, labeled "Customer," positioned between the Sales Type filter and the Location filter."

#### SBC S18-R2: Customer type-ahead scoped to Sales Type (ADD)

> **SBC v21 S18-R2:** "S18-R2: The filter is a multi-select with server-backed type-ahead. The control carries a search (magnifier) icon marking it as searchable. The dropdown does not load the full customer list into the browser; instead, as the user types, it fetches matching customers from the server — case-insensitive "contains" matching on the customer name, scoped to the active date range, Sales Type, and location — and lists the returned customers, each shown with a checkmark when selected. A "Search customers…" hint is pinned to the top of the dropdown before any query is typed, and yields to the typed query while the user is searching. Before the user types, the dropdown shows the pinned all/clear control (S18-R3) and the hint; the user types to reveal individual customers to select or deselect."

#### SBC S21-R1: Mobile: Sales Type works on touch (ADD)

> **SBC v21 S21-R1:** "S21-R1: Every toolbar control — date range, Sales Type, the Customer filter, location, the overflow menu, and the column selector — is visible and works on touch."

### b3. PRD v8 requirements that SBR v28 does not restate (the PRD stays the source; listed so the cases quote the PRD for them)

> **PRD v8 S5-R7:** "S5-R7: A cent left over by rounding the share goes to the Labor row."

> **PRD v8 S5-R8:** "S5-R8: A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned."

> **PRD v8 S5-R15:** "S5-R15: On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero."

> **PRD v8 S5-R15a:** "S5-R15a: On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when it has none."

> **PRD v8 S5-R16:** "S5-R16: A representative's summary row always shows real sums, never dashes."

> **PRD v8 S5-R17:** "S5-R17: On an invoice row, the Margin % uses only the side the row is credited with."

> **PRD v8 S5-R24:** "S5-R24: The Sales Type column holds no money, so the report's existing rules for who may see money apply to the other columns unchanged."

> **PRD v8 S5-N1:** "S5-N1: An invoice totaling $0.00 adds $0.00 to each representative it is credited to, and counts once for each, as a single representative's $0.00 invoice does today. On a split work order, a side with no dollars (for example no parts at all) still gives its representative a $0.00 row, and the invoice counts once for them."

> **PRD v8 S5-N2:** "S5-N2: A negative amount is always credited to a representative, never dropped or left out. A returned part on the invoice reduces the parts representative and a labor credit reduces the labor representative, the same way positive amounts are credited."

> **PRD v8 S5-E1:** "S5-E1: When one side is negative, the shares are still measured by size. Example: labor $600.00, parts ($100.00), whole-invoice discount ($70.00). The shares are six sevenths and one seventh, so the Labor row gets ($60.00) and the Parts row ($10.00). Subtotals $540.00 and ($110.00) add up to $430.00, the invoice total."

> **PRD v8 S5-E2:** "S5-E2: Every invoice created before the release has its one representative on both sides, so the report for any past date reads exactly as before, with that person's Labor and Parts rows shown as one "Labor, Parts" row (S5-R10). Invoices created before 2026-07-29 have no representative recorded; they stay Unassigned on both sides, and none is added."

> **PRD v8 S8-R4:** "S8-R4: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file."

> **PRD v8 S8-R9:** "S8-R9: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

> **PRD v8 S4-R24:** "S4-R24: A new work order for a customer that is not split starts with the customer's representative in its one Sales Representative field. The work order is not split."


## c. Answers these spec versions give to the open questions

Baseline questions: baseline/V1-BASELINE-AND-INVARIANTS.md §d, Q1-Q10. Tech-plan questions: review/TECHPLAN-JIRA-REVIEW.md §e, Q1-Q15.

**Answered: 5.**
- Baseline Q3: Summary downloads unchanged.
- Baseline Q6: SBC menu rows are "Select all" and "Clear selection".
- Baseline Q8: the field is read-only in History mode.
- Tech-plan Q10: "Sales Type on" is remembered in this browser only.
- Baseline Q7: answered by SBR v28, but it conflicts with PRD v8, so it stays a DIVERGE question.

**Still open: 20.**

#### Baseline Q1: still open

> **SBR v28 S13-R10:** "S13-R10: Customer assignments are not modified by deactivation. Every customer stays assigned to this rep; denormalized rep names and past invoice snapshots are preserved."

> **SBR v28 S13-E3:** "S13-E3: A deactivated rep can be reactivated anytime via the standard toggle; assignments re-surface immediately with no extra action. Reactivation never shows the warning dialog."

> **PRD v8 S4-R20:** "S4-R20: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26)."

Note: SBR v28 still states today's rule (unchanged from v24), so two current documents now conflict.

#### Baseline Q2: still open

> **SBR v28 S13-R1:** "S13-R1: When the user toggles the staff member's active status off, the system first runs a precondition check returning the count of distinct customers currently assigned to that staff member as their sales rep, plus a flag indicating whether any assignments exist."

> **SBR v28 S13-N2:** "S13-N2: If the staff member does not have the sales-rep toggle on, the precondition check is skipped and no warning is shown."

Note: Only the type-YES dialog is in SBR v28, and its count rule is not reworded. The "Turn Off Sales Representative" warning is not in either spec.

#### Baseline Q3: answered (option A)

> **SBR v28 S14-R5:** "S14-R5: Summary PDF — one rolled-up row per rep, in the report's currently-active order (S14-R2a), with an "(Inactive)" tag on toggled-off contributors (S5-R9). Columns: Rep / Labor Delta / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Shop Supplies / Adjustments / Margin / Margin % / Subtotal. Subtotal bolded across header, body, and the grand totals row; Labor Delta colored. The grand totals row reads "Totals" in the Rep cell and shows, for each metric column, the grand aggregate across all summary rows in the document — rep rows plus the Unassigned row when Show Unassigned is on (money and Labor Delta summed from unrounded values; Margin % recomputed as total Margin ÷ total Margin base, "—" when ≤ 0)."

> **SBR v28 S14-R15:** "S14-R15: Summary CSV — file sales-by-representative-summary.csv, UTF-8 BOM, one header row + one row per rep in the current filtered view, in the currently-active order (S14-R2a). Headers, in order: Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. Generated server-side against the current filters and active sort (S14-R2a)."

> **SBR v28 S20-R8:** "S20-R8: The column selector state does not affect any export; all four downloads always include all metric columns, and both Expanded downloads always include Sales Type, whether or not it is shown on screen."

Note: The Summary column lists have no Sales Type, and only the Expanded downloads carry it.

#### Baseline Q4: still open

> **SBR v28 S5-R2:** "S5-R2: The columns appear left-to-right: Date, Invoice, Customer, Status, Sales Type, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. (15 columns: five leading identifier columns, nine metric columns, and Subtotal.) Sales Type is filled on invoice detail rows only and reads "Labor", "Parts", "Part Sales" or "Labor, Parts" (the Splitting Sales Representatives PRD (epic SV-10890), S5-R19). It is off by default on screen and can be turned on from the column selector (Story 20); while it is off, the columns that follow sit one place to the left."

> **SBR v28 S18-R13:** "S18-R13: When shown (S21-R7), the Location column appears at the end of the leading identifier group — immediately after the Status column and before the first metric column (Labor Delta) — on every rep summary row and invoice detail row, matching the Location column's placement across the reports suite; it never displaces the pinned Subtotal column, which stays rightmost (S10-R1). The toolbar's Location filter control keeps a constant width regardless of the selected label (a single location name, several names, or "All Locations"), so the toolbar layout does not shift as the selection changes."

> **SBR v28 S14-R20:** "S14-R20: Location in exports. Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen — Summary and Expanded, PDF and CSV: a Summary (rolled-up) row carries the rep's location, reading Multiple when that rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact location. In addition, every export (each PDF and each CSV, Summary and Expanded) includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected — matching the on-screen scope. In a PDF the "Locations:" line appears in the header strip; in a CSV it appears as a leading metadata line above the column-header row. In the shorter Summary download, which has no Date or Status column, the Location column appears immediately after the Representative name."

Note: v28 puts Sales Type after Status but did not update the Location placement, and both are "immediately after Status".

#### Baseline Q5: still open (implied A)

> **SBR v28 line 39:** "Parts and service representatives. A customer, a Work Order and an invoice each carry a parts representative and a service representative, and one person may hold both. At invoice creation both sides are captured onto the invoice. When the Work Order has nobody on either side, each side takes the customer's representative for that side (a part sale takes the customer's Part Sales choice for the whole sale); when that is also absent, the side is unassigned (Story 22). Labor dollars, hours and shop supplies are credited to the labor representative and parts dollars to the parts representative; whole-invoice fees and discounts are shared by the size of each side. Each side shows as its own row with a Sales Type: Labor, Parts or Part Sales. Every rule for the two sides is owned by the Splitting Sales Representatives PRD (epic SV-10890), Stories 4 and 5. This report applies them."

> **SBR v28 S5-R11:** "S5-R11: Adjustments is the signed net of invoice-level fees and discounts across the row's invoices: fees count positive, discounts count negative. A line-level fee or discount stays folded into its own line's Labor or Parts value; an invoice-level amount is never allocated into the Labor or Parts columns."

Note: Only Adjustments can hold an invoice-level amount, because it is "never allocated into the Labor or Parts columns". No sentence says the share goes there, and the Adjustments definition still describes the whole net.

#### Baseline Q6: answered

> **SBC v21 S3-R2:** "S3-R2: Its menu offers two options, each with a checkbox, "Part Sales" and "Service Sales", under a "Select all" row, with "Clear selection" at the bottom."

Note: The rows are now "Select all" (top) and "Clear selection" (bottom). This is neither A, B nor C exactly: both rows are renamed and "Clear selection" moves to the bottom.

#### Baseline Q7: answered in SBR v28 (option B), but it conflicts with PRD v8, so still open as a DIVERGE

> **SBR v28 S15-R1:** "S15-R1: The dialog's Report Name dropdown includes "Sales Rep Assignments," appended at the bottom of the list (additive)."

> **SBR v28 S15-R3:** "S15-R3: The Export action downloads sales-rep-assignments.csv and shows a success toast (§7)."

> **SBR v28 S15-R4:** "S15-R4: The CSV has a header row + one row per customer per assigned person. Headers, in order: Customer Name, Sales Rep, Rep is active?, Side. UTF-8 BOM prepended."

> **PRD v8 S4-R23:** "S4-R23: The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales"."

Note: SBR keeps "Sales Rep Assignments", sales-rep-assignments.csv, "Sales Rep" and "Rep is active?", and adds "Side" after it. The PRD says "Representative is active?".

#### Baseline Q8: answered (option A)

> **SBR v28 S19-R1:** "S19-R1: The left panel of a standard Work Order includes a Sales Representative field, which can be split into "Sales Representative - Labor" and "Sales Representative - Parts" (the Splitting Sales Representatives PRD (epic SV-10890), Stories 1 and 2). A Part Sale WO keeps a single Sales Representative field whose one rep holds both sides. The field is hidden on imported Work Orders and read-only in History mode."

#### Baseline Q9: still open

> **SBC v21 S6-R1:** "S6-R1: The report saves the user's view to the browser so it can be restored on the next visit."

> **SBC v21 S3-R8:** "S3-R8: The Sales Type selection is remembered between visits (Story 6)."

> **SBC v21 S9-R3:** "S9-R3: Before navigating, the active date range and Sales Type are written to the page link so the report can be restored."

Note: SBC v21 still describes a view saved in the browser, which is reading B. No sentence covers values saved before the release, and SBC v21 does not reflect SV-9984.

#### Baseline Q10: still open

Note: Neither report spec covers the work order card.

#### Tech plan Q1: still open

> **SBR v28 line 58:** "All displayed numeric values round half-up (away from zero) at their stated precision (money to cents; Labor Delta to one decimal; Margin % to two decimals). Rolled-up values are computed from unrounded components and then rounded, so a totals cell may differ from the eye-summed displayed rows by one unit in the last decimal — this is expected."

Note: SBR rounds displayed values half-up away from zero. That is display rounding, not the rule for splitting a whole-invoice amount between the sides.

#### Tech plan Q2: still open

Note: Work order card; not in the report specs.

#### Tech plan Q3: still open

Note: Phone card; not in the report specs.

#### Tech plan Q4: still open

Note: Customer migration; not in the report specs.

#### Tech plan Q5: still open

> **SBR v28 S5-R9:** "S5-R9: Inactive-rep marker. When a rendered rep's sales-rep toggle is currently off (or their staff record has been deleted) but they have matching invoices, their display name is followed by a subdued "(Inactive)" tag — e.g., Mary Smith (Inactive) (12) — rendered in the same muted grey as the count. A rep whose toggle is currently on shows no tag. The tag is a display marker only; it does not change the rep's metrics, position in the A→Z order, or expandability. For a rep whose staff record has been deleted, both the display name and the A→Z sort position come from the denormalized rep-name snapshot on the rep's most recent matching invoice (by invoice date, ties broken by invoice number per S6-R9), so a name that drifted across invoices resolves deterministically and the row still shows a historical name and sorts correctly."

Note: SBR covers only the report row (a deleted staff record shows the captured name). It says nothing about the card or the audit log.

#### Tech plan Q6: still open

> **SBR v28 S19-R1:** "S19-R1: The left panel of a standard Work Order includes a Sales Representative field, which can be split into "Sales Representative - Labor" and "Sales Representative - Parts" (the Splitting Sales Representatives PRD (epic SV-10890), Stories 1 and 2). A Part Sale WO keeps a single Sales Representative field whose one rep holds both sides. The field is hidden on imported Work Orders and read-only in History mode."

Note: SBR says only that a part sale keeps one field. Nothing about its label or look.

#### Tech plan Q7: still open

> **SBR v28 S19-R7:** "S19-R7: The customer record's left-panel sidebar shows the customer's sales representatives with the customer window's labels: one "Sales Representative" row, or "Sales Representative - Service Labor", "- Service Parts" and "- Part Sales" when split; an empty one reads "Unassigned" (the Splitting Sales Representatives PRD (epic SV-10890), S4-R19)."

Note: The customer sidebar labels are given. Nothing says whether a person whose switch is off shows "(Inactive)" there.

#### Tech plan Q8: still open

#### Tech plan Q9: still open

Note: SBR does not restate PRD S5-R8.

#### Tech plan Q10: answered (option a, this browser only)

> **SBR v28 S23-R1:** "S23-R1: The report remembers, per browser, the user's filter and view settings: date range (incl. custom start/end), sales type, invoice status, location, Show Unassigned, column visibility, and the active column sort (column + direction). On the next visit — including after leaving and returning, or a page reload — these are restored before the first data fetch."

> **SBR v28 S23-N1:** "S23-N1: Clearing browser storage returns the report to first-visit defaults (S23-R4). No server-side profile is kept."

> **SBR v28 S20-R5:** "S20-R5: Column visibility is persisted and restored per Story 23."

#### Tech plan Q11: still open

#### Tech plan Q12: still open

#### Tech plan Q13: still open

Note: Jira versus PRD; not in the report specs.

#### Tech plan Q14: still open

#### Tech plan Q15: still open


## d. Today's sentences that stay unchanged and can be quoted by a "must not change" test

The script checked that each sentence is word-for-word identical in the old copy (SBR v24 / SBC v20) and the new one.
- **Not in either spec:** the dashboard tile, and the "Turn Off Sales Representative" switch-off warning. A test for those needs another source.
- **Do not quote as must-not-change until the PO answers:** rows marked "under DIVERGE" (S13-R4; S15-R1). PRD S4-R20 and S4-R23 may change them.

| Spec | Ref | What it fixes | Identical in old copy (v24 / v20)? |
|---|---|---|---|
| SBR | line 62 | Rep order A to Z, Unassigned pinned to the top | yes |
| SBR | S11-R2 | Sorting moves rep rows only; Unassigned stays pinned | yes |
| SBR | S11-R4 | Default A to Z order | yes |
| SBR | S11-R7 | Tie-break by A to Z | yes |
| SBR | S22-R1 | Show Unassigned toggle, off by default | yes |
| SBR | S22-R4 | Unassigned pinned to the top | yes |
| SBR | S22-R5 | Unassigned row behaves like a rep row | yes |
| SBR | S5-R3 | Rep name in the Date cell | yes |
| SBR | S5-R4 | (N) count | yes |
| SBR | S5-R9 | "(Inactive)" marker | yes |
| SBR | S5-R12 | Every row ties out | yes |
| SBR | S6-R9 | Detail-row order | yes |
| SBR | S9-R2 | Labor Delta value | yes |
| SBR | S13-R3 | Deactivate dialog title | yes |
| SBR | S13-R4 | Deactivate dialog body (under DIVERGE, see S4-R20 / Q1) | yes |
| SBR | S13-R6 | Type YES instruction | yes |
| SBR | S13-R7 | Deactivate button gate | yes |
| SBR | S13-R8 | Cancel / X / Escape | yes |
| SBR | S13-N2 | Switch off: no warning | yes |
| SBR | S13-N3 | Already inactive: no dialog | yes |
| SBR | S13-N4 | Check fails: dialog still shown | yes |
| SBR | S14-R1 | Four download actions | yes |
| SBR | S14-R5 | Summary PDF | yes |
| SBR | S14-R15 | Summary CSV | yes |
| SBR | S14-R18 | # Invoices / # Customers | yes |
| SBR | S14-R19 | Unassigned in exports | yes |
| SBR | S15-R1 | Assignments export in the Export Reports dialog (name under DIVERGE, Q7) | yes |
| SBR | S15-R2 | Assignments dialog note | yes |
| SBR | S15-R3 | Assignments file name and toast | yes |
| SBR | S15-R7 | Assignments row order | yes |
| SBR | S15-R10 | Customers with no rep not listed | yes |
| SBR | S15-N2 | Assignments: nothing to export | yes |
| SBR | S16-R1 | Empty state message | yes |
| SBR | S19-R4 | Save on change | yes |
| SBR | S19-R5 | Read-only when Invoiced or Paid | yes |
| SBR | S19-N1 | Not on imported work orders | yes |
| SBR | S19-N2 | Past invoices not altered | yes |
| SBR | S23-R2 | Expansion and scroll not remembered | yes |
| SBC | S7-R1 | One row per customer | yes |
| SBC | S7-R3 | Invoice count after the name | yes |
| SBC | S7-R18 | Every row ties out | yes |
| SBC | S8-R6 | "Parts Sales" bucket last | yes |
| SBC | S8-E3 | No-vehicle S invoice in "Parts Sales" | yes |
| SBC | S10-R4 | Default sort | yes |
| SBC | S13-R4 | Toggleable columns | yes |
| SBC | S14-R4 | Summary CSV columns | yes |
| SBC | S14-R5 | Expanded CSV columns | yes |
| SBC | S17-R1 | Empty-state message | yes |

> **SBR v28 line 62:** "Rep ordering is plain A→Z by display name (case-insensitive), with the "Unassigned" row pinned to the top when shown. There are no active/inactive tiers. A user column-sort replaces the default A→Z (Story 11)."

> **SBR v28 S11-R2:** "S11-R2: Sorting reorders rep summary rows only; invoice detail rows stay grouped under their parent rep, and the Unassigned row (when shown) stays pinned to the top regardless of sort."

> **SBR v28 S11-R4:** "S11-R4: On first load (no remembered sort — Story 23, and before any header click), rows render in A→Z order by display name (case-insensitive), with no active/inactive tiers. This is the default."

> **SBR v28 S11-R7:** "S11-R7: Tie-break. When two reps have equal values in the sorted column, they retain the default A→Z order. A Margin % cell rendered "—" (undefined) sorts as zero."

> **SBR v28 S22-R1:** "S22-R1: A "Show Unassigned" toggle sits in the toolbar between the column selector and the date range picker (per the S18-R7.2 order). It is off by default (no remembered setting — Story 23)."

> **SBR v28 S22-R4:** "S22-R4: The Unassigned row is pinned to the top of the table, above the A→Z reps, and stays pinned regardless of sort (S11-R2)."

> **SBR v28 S22-R5:** "S22-R5: The Unassigned row behaves like any rep summary row: same metric columns, the (N) count, expandable (S6-R1) to its contributing invoices, and included in the grand Totals indicator. It never carries an "(Inactive)" tag."

> **SBR v28 S5-R3:** "S5-R3: On a rep summary row, the Date cell holds the chevron expand/collapse control followed by the rep's display name (format "First Last"). The date value for that row is intentionally blank."

> **SBR v28 S5-R4:** "S5-R4: The number of invoices contributing to that rep in the current filtered view is displayed in parentheses after the rep's name, in a smaller, subdued grey font — e.g., Mary Smith (12). Because a rep only appears when they have ≥1 matching invoice (S5-R1), the count is always ≥1."

> **SBR v28 S5-R9:** "S5-R9: Inactive-rep marker. When a rendered rep's sales-rep toggle is currently off (or their staff record has been deleted) but they have matching invoices, their display name is followed by a subdued "(Inactive)" tag — e.g., Mary Smith (Inactive) (12) — rendered in the same muted grey as the count. A rep whose toggle is currently on shows no tag. The tag is a display marker only; it does not change the rep's metrics, position in the A→Z order, or expandability. For a rep whose staff record has been deleted, both the display name and the A→Z sort position come from the denormalized rep-name snapshot on the rep's most recent matching invoice (by invoice date, ties broken by invoice number per S6-R9), so a name that drifted across invoices resolves deterministically and the row still shows a historical name and sorts correctly."

> **SBR v28 S5-R12:** "S5-R12: Every row ties out: Labor Invoiced + Parts Invoiced + Shop Supplies + Adjustments = Subtotal, and Labor Margin + Parts Margin + Adjustments = Margin — on rep summary rows, invoice detail rows, and the grand Totals indicator alike."

> **SBR v28 S6-R9:** "S6-R9: Within an expanded rep (and within the Unassigned row), invoice detail rows are ordered by invoice date descending (newest first), tie-broken by invoice number ascending by the numeric portion after the P/S prefix (numeric, not lexical — so S999 precedes S1000); if both the date and the numeric portion tie (e.g., P100 and S100 on the same day), P (Parts) sorts before S (Service). This order is independent of the rep-row column sort (Story 11, which reorders rep summary rows only) and is the same order used in the Expanded View PDF per-rep tables (S14-R6) and the Expanded CSV (S14-R16)."

> **SBR v28 S9-R2:** "S9-R2: The value is hours invoiced − hours worked (§3), rounded half-up to one decimal."

> **SBR v28 S13-R3:** "S13-R3: If there are assignments, a warning dialog titled "Deactivate {Staff Name}?" opens before any change is applied; the deactivation does not commit until confirmed."

> **SBR v28 S13-R4:** "S13-R4: The dialog body shows "{Staff Name} is the sales rep on {N} customer{s}." — where the noun is singular for N=1 ("1 customer") and plural otherwise ("3 customers") — followed by the reassurance line "Their customer assignments will stay where they are.""

> **SBR v28 S13-R6:** "S13-R6: Below the reassurance copy, instruction text reads "Type YES to confirm" (with "YES" emphasized) and a single auto-focused text input."

> **SBR v28 S13-R7:** "S13-R7: The primary action is a "Deactivate" button, disabled until the input matches the confirmation word case-insensitively and ignoring leading/trailing whitespace (yes, YES, Yes, yes all enable it). Pressing Enter while valid submits. While disabled, hovering it shows the tooltip "Type YES above to enable.""

> **SBR v28 S13-R8:** "S13-R8: The dialog also has a "Cancel" button (red outline) and an "X" close icon. It dismisses (without deactivating) on Cancel, X, or Escape. Clicking outside the dialog does not dismiss it. Any dismissal leaves the staff member's active status unchanged."

> **SBR v28 S13-N2:** "S13-N2: If the staff member does not have the sales-rep toggle on, the precondition check is skipped and no warning is shown."

> **SBR v28 S13-N3:** "S13-N3: If the staff member is already inactive, this flow does not apply (reactivation has no assignment implications and never shows the dialog)."

> **SBR v28 S13-N4:** "S13-N4: If the precondition check itself fails, the system falls back to showing the warning dialog (so the type-to-confirm gate still applies); it never silently deactivates. In this check-failed path the customer count is unavailable, so the dialog omits the count headline (S13-R4) and shows only the reassurance line "Their customer assignments will stay where they are." above the "Type YES to confirm" gate."

> **SBR v28 S14-R1:** "S14-R1: The toolbar's â‹¯ overflow menu lists exactly four actions: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)"."

> **SBR v28 S14-R5:** "S14-R5: Summary PDF — one rolled-up row per rep, in the report's currently-active order (S14-R2a), with an "(Inactive)" tag on toggled-off contributors (S5-R9). Columns: Rep / Labor Delta / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Shop Supplies / Adjustments / Margin / Margin % / Subtotal. Subtotal bolded across header, body, and the grand totals row; Labor Delta colored. The grand totals row reads "Totals" in the Rep cell and shows, for each metric column, the grand aggregate across all summary rows in the document — rep rows plus the Unassigned row when Show Unassigned is on (money and Labor Delta summed from unrounded values; Margin % recomputed as total Margin ÷ total Margin base, "—" when ≤ 0)."

> **SBR v28 S14-R15:** "S14-R15: Summary CSV — file sales-by-representative-summary.csv, UTF-8 BOM, one header row + one row per rep in the current filtered view, in the currently-active order (S14-R2a). Headers, in order: Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. Generated server-side against the current filters and active sort (S14-R2a)."

> **SBR v28 S14-R18:** "S14-R18: # Invoices = the count of the rep's matching invoices in the current filtered view (same as the on-screen (N)). # Customers = the count of distinct customers across those matching invoices (de-duplicated across locations when several are selected)."

> **SBR v28 S14-R19:** "S14-R19: Unassigned row in exports. When Show Unassigned is on, the Unassigned row is emitted in all four downloads exactly as it appears on screen: in the Summary PDF and Summary CSV as one rolled-up row whose Rep / Sales Rep cell reads the literal "Unassigned" (sorted to the top per S22-R4); in the Expanded CSV, its invoices carry Sales Rep = "Unassigned"; in the Expanded View PDF as its own top page-block titled "Unassigned". The Summary PDF grand-totals row aggregates across all summary rows including Unassigned (S14-R5); in the Summary CSV, the Unassigned row is simply one of the data rows (the CSV has no totals row, S14-R15). When Show Unassigned is off, no Unassigned row or unassigned invoices appear in any export."

> **SBR v28 S15-R1:** "S15-R1: The dialog's Report Name dropdown includes "Sales Rep Assignments," appended at the bottom of the list (additive)."

> **SBR v28 S15-R2:** "S15-R2: Selecting it hides the date range picker and shows the note: "Snapshot of current sales rep assignments. Both active and inactive reps with assignments are listed.""

> **SBR v28 S15-R3:** "S15-R3: The Export action downloads sales-rep-assignments.csv and shows a success toast (§7)."

> **SBR v28 S15-R7:** "S15-R7: Rows are sorted by customer name A→Z (primary), then rep name A→Z (secondary)."

> **SBR v28 S15-R10:** "S15-R10: Customers with no assigned rep are not included."

> **SBR v28 S15-N2:** "S15-N2: With zero assigned customers, the CSV downloads with a header row and no data rows, and the dialog shows its empty-export warning: "There is no data to export for the selected report." (§7)."

> **SBR v28 S16-R1:** "S16-R1: Empty state. When the current filter set produces no rep rows (no rep has a matching invoice and — if Show Unassigned is on — there are no matching unassigned invoices either), the table shows no data rows and the empty-state message "No sales activity matches the current filters." The grand Totals indicator is not shown."

> **SBR v28 S19-R4:** "S19-R4: Changing the Sales Rep persists immediately, with no separate Save step (save-on-change)."

> **SBR v28 S19-R5:** "S19-R5: The selector is read-only (non-interactive) when the WO status is "Invoiced" or "Paid"."

> **SBR v28 S19-N1:** "S19-N1: The selector is not present on imported Work Orders."

> **SBR v28 S19-N2:** "S19-N2: Changing a WO's Sales Rep does not retroactively alter invoices already created from it."

> **SBR v28 S23-R2:** "S23-R2: The report does not remember expansion state or scroll position; both reset on reload. (Browser back-navigation from a drilldown is the exception that restores everything — S12-R3a.)"

> **SBC v21 S7-R1:** "S7-R1: Each customer occupies one summary row at the top level of the table."

> **SBC v21 S7-R3:** "S7-R3: The number of invoices contributing to that customer's totals in the current view is shown in parentheses immediately after the name — for example, Acme Corp (5)."

> **SBC v21 S7-R18:** "S7-R18: Every row ties out: Labor Invoiced + Parts Invoiced + Shop Supplies + Adjustments = Subtotal, and Labor Margin + Parts Margin + Adjustments = Margin — on customer rows, asset rows, invoice rows, and the totals row alike."

> **SBC v21 S8-R6:** "S8-R6: A customer's work with no vehicle collects under a single row labeled "Parts Sales," always sorted last among that customer's assets."

> **SBC v21 S8-E3:** "S8-E3: No-vehicle work collects under "Parts Sales" based on the absence of a vehicle, not on the invoice-number prefix; a service (S) invoice with no vehicle therefore also appears in that customer's "Parts Sales" row."

> **SBC v21 S10-R4:** "S10-R4: The default sort on first load is Customer name, ascending, case-insensitive."

> **SBC v21 S13-R4:** "S13-R4: The ten toggleable columns are, in order: Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %."

> **SBC v21 S14-R4:** "S14-R4 (Summary contents): The Summary CSV has one row per customer and no asset or invoice rows. Its columns, in this exact order, are: Customer, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal."

> **SBC v21 S14-R5:** "S14-R5 (Expanded contents): The Expanded CSV contains the full Customer → Asset → Invoice tree. Its columns, in this exact order, are: Customer, Asset, Invoice #, Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal."

> **SBC v21 S17-R1:** "S17-R1: When no customers match, the table body shows the message "No sales data found for the selected filters.""


## Other things noticed (outside this feature; not acted on)
- SBR §3 line 66 says the Location column is shown "only when the current view spans more than one location". S21-R7 and §2 line 18 say it is shown to any user with access to more than one location. This is old text and the two disagree.
- SBR context note (line 47) says Sales By Customer uses the same Margin base. SBC v21 S7-R11 and its Terminology still say Margin % = Margin ÷ Subtotal, to one decimal.
- SBR S9-R1 still says "(verbatim, including the period after "Inv")" and SBC S12-R1 says "(including the period after "Inv")". Both headings now read "Labor Delta", so these sentences are stale.

## OUTSTANDING: what I need from you
- Nothing for this task itself.
- The DIVERGE rows and the questions still open are inputs for the PO question sheet, which the lane session prepares and sends last (Rule 66). The most important are:
  1. Empty export when no Sales Type is selected. PRD: "Empty export", no file. SBR S3-R10 / S14-E3 and SBC S3-R7 / S15-R10 / S18-R10: a file with a "None" or "No sales" line.
  2. Deactivation: PRD S4-R20 against SBR Story 13 and S15-R2 / S15-R6 (baseline Q1).
  3. New work orders: SBR S19-R3 still says they open "Unassigned"; PRD S4-R24 to S4-R26 fill them from the customer.
  4. The Assignments export: heading, name and Side values (S15-R1, S15-R4, S15-R5, S15-R9 against PRD S4-R23).
  5. Adjustments on a split invoice (S5-R11 against PRD S5-R6).
  6. Labor Delta on a Parts row: 0.0 (S9-N1) or a dash (PRD S5-R15)?
  7. Location against Sales Type column order (S18-R13 against S5-R2).
  8. The Release-day reset of saved columns and sort (S20-R6a against PRD Release day).
  9. SBR Key Decision line 36: "Each invoice appears under exactly one rep".
