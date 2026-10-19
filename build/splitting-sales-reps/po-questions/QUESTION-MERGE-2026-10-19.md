# Splitting Sales Representatives: how the PO questions were merged (19 Oct 2026)

Every source question, where it went, and which were dropped as already answered. Built by script; the script fails if any source item is missing, duplicated or unknown.

- Source items: **65** (tech plan review Q1-Q15, baseline Q1-Q10, 19 Sales By Representative v28 DIVERGE rows, 3 Sales By Customer v21 DIVERGE rows, design Q1-Q11, design SPEC-CONFLICT C1-C5, lane questions A and B).
- Dropped as answered: **4**. Merged into the sheet: **61** source items into **38** rows.

Source files: TP = review/TECHPLAN-JIRA-REVIEW.md §e; BL = baseline/V1-BASELINE-AND-INVARIANTS.md §d; SBR-DIV = report-specs/REPORT-SPECS-REVIEW-2026-10-19.md §b1 (DIVERGE); SBC-DIV = report-specs/REPORT-SPECS-REVIEW-2026-10-19.md §b2 (DIVERGE); DES-Q = design-drive-2026-10-19/DESIGN-REVIEW-2026-10-19.md §8; DES-C = design-drive-2026-10-19/DESIGN-REVIEW-2026-10-19.md §6 (SPEC-CONFLICT); LANE = lane session, 19 Oct 2026.

## Final rows and the source items each covers

| Row | Area | Topic | Source items covered |
|---|---|---|---|
| 1 | Work order card | work order card, height of the box around the Sales Representative field | TP-Q2 |
| 2 | Work order card | work order card, space between the field and the + and remove x buttons | DES-Q5, DES-C5 |
| 3 | Work order card | work order card, today's gap under Lead Technician (low priority) | TP-Q12 |
| 4 | Work order card | work order card, where Lead Technician's messages show | BL-Q10 |
| 5 | Work order card | work order card and Audit Log, a person who no longer exists or belongs to another organization | TP-Q5 |
| 6 | Work order card | work order card, two people editing the same work order | TP-Q8 |
| 7 | Work order card | part sale card, does its Sales Representative field change at all | TP-Q6 |
| 8 | Work order card | invoiced work order card, small and capital letters in the labels | DES-Q11 |
| 9 | Phone | phone, how the hidden fields on the work order card are opened | TP-Q3 |
| 10 | Phone | large touch tablet, how the work order card behaves | TP-Q11 |
| 11 | Phone | phone, dropdown arrow on the Sales Representative fields | DES-Q4, DES-C3 |
| 12 | Customer | customer, deactivating a staff member who is a customer's sales representative | BL-Q1, SBR-DIV S13-R4, SBR-DIV S13-R10, SBR-DIV S13-R11, SBR-DIV S13-E1, SBR-DIV S13-E3, SBR-DIV S15-R2, SBR-DIV S15-R6 |
| 13 | Customer | customer, which warning shows the new customer count | BL-Q2 |
| 14 | Customer | customer, how a person whose Sales Representative switch is off reads | TP-Q7 |
| 15 | Customer | customer, order of the names in the Sales Representative list | DES-Q3, DES-C2 |
| 16 | Customer | customer, New Customer opened from a part sale by a user who can only make part sales | TP-Q15 |
| 17 | Customer | Sales Representative Assignments export, its name and column headings | BL-Q7, SBR-DIV S15-R1, SBR-DIV S15-R4 |
| 18 | Customer | Sales Representative Assignments export, how a Part Sales person is listed | SBR-DIV S15-R5 |
| 19 | Release day | release day, about 10 customers whose representative is no longer a user | TP-Q4 |
| 20 | Release day | release day, saved column choices on Sales By Representative | SBR-DIV S20-R6a |
| 21 | Sales By Representative credit | Sales By Representative, who gets the odd cent when a discount is shared | TP-Q1 |
| 22 | Sales By Representative credit | Sales By Representative, which column shows each row's share of a fee or discount | BL-Q5, SBR-DIV S5-R11 |
| 23 | Sales By Representative credit | Sales By Representative, a fee on an invoice with no labor and no parts | TP-Q9 |
| 24 | Sales By Representative screen and exports | Sales By Representative, what the Parts row shows in the labor columns | DES-Q1, DES-C1, SBR-DIV S9-N1 |
| 25 | Sales By Representative screen and exports | Sales By Representative, Shop Supplies on a part sale that has none | DES-Q2, DES-C4 |
| 26 | Sales By Representative screen and exports | Sales By Representative, order of the Sales Type and Location columns | BL-Q4, SBR-DIV S18-R13 |
| 27 | Sales By Representative screen and exports | Sales By Representative and Sales By Customer, Export with no Sales Type ticked | SBR-DIV S3-R10, SBR-DIV S14-E3, SBC-DIV S3-R7, SBC-DIV S15-R10, SBC-DIV S18-R10 |
| 28 | Sales By Customer | Sales By Customer, the names of the two filter options | DES-Q6 |
| 29 | Sales By Customer | Sales By Customer, what "remembered from before the release" means | BL-Q9 |
| 30 | Print | printed work order, a staff member who no longer exists | LANE-B |
| 31 | Log | Audit Log, adding the Parts field when both sides keep the same person | LANE-A |
| 32 | Log | Audit Log, who can open it | TP-Q14 |
| 33 | Design only | design, invoice dates differ between the screen and the downloads | DES-Q7 |
| 34 | Design only | design, the numbered decisions its notes refer to | DES-Q8 |
| 35 | Design only | design, screens the feature spec describes but the design does not show | DES-Q9 |
| 36 | Design only | design, the column picker tooltip hides the Sales Type switch | DES-Q10 |
| 37 | Documents out of date | Jira stories older than the feature spec | TP-Q13 |
| 38 | Documents out of date | sentences in the Sales By Representative spec that were not updated | SBR-DIV line 36, SBR-DIV S19-R3, SBR-DIV S15-R9 |

## Every source item, in source order

| Source item | Sheet row |
|---|---|
| TP-Q1 | 21 |
| TP-Q2 | 1 |
| TP-Q3 | 9 |
| TP-Q4 | 19 |
| TP-Q5 | 5 |
| TP-Q6 | 7 |
| TP-Q7 | 14 |
| TP-Q8 | 6 |
| TP-Q9 | 23 |
| TP-Q10 | dropped (answered) |
| TP-Q11 | 10 |
| TP-Q12 | 3 |
| TP-Q13 | 37 |
| TP-Q14 | 32 |
| TP-Q15 | 16 |
| BL-Q1 | 12 |
| BL-Q2 | 13 |
| BL-Q3 | dropped (answered) |
| BL-Q4 | 26 |
| BL-Q5 | 22 |
| BL-Q6 | dropped (answered) |
| BL-Q7 | 17 |
| BL-Q8 | dropped (answered) |
| BL-Q9 | 29 |
| BL-Q10 | 4 |
| SBR-DIV line 36 | 38 |
| SBR-DIV S3-R10 | 27 |
| SBR-DIV S5-R11 | 22 |
| SBR-DIV S9-N1 | 24 |
| SBR-DIV S13-R4 | 12 |
| SBR-DIV S13-R10 | 12 |
| SBR-DIV S13-R11 | 12 |
| SBR-DIV S13-E1 | 12 |
| SBR-DIV S13-E3 | 12 |
| SBR-DIV S14-E3 | 27 |
| SBR-DIV S15-R1 | 17 |
| SBR-DIV S15-R2 | 12 |
| SBR-DIV S15-R4 | 17 |
| SBR-DIV S15-R5 | 18 |
| SBR-DIV S15-R6 | 12 |
| SBR-DIV S15-R9 | 38 |
| SBR-DIV S18-R13 | 26 |
| SBR-DIV S19-R3 | 38 |
| SBR-DIV S20-R6a | 20 |
| SBC-DIV S3-R7 | 27 |
| SBC-DIV S15-R10 | 27 |
| SBC-DIV S18-R10 | 27 |
| DES-Q1 | 24 |
| DES-Q2 | 25 |
| DES-Q3 | 15 |
| DES-Q4 | 11 |
| DES-Q5 | 2 |
| DES-Q6 | 28 |
| DES-Q7 | 33 |
| DES-Q8 | 34 |
| DES-Q9 | 35 |
| DES-Q10 | 36 |
| DES-Q11 | 8 |
| DES-C1 | 24 |
| DES-C2 | 15 |
| DES-C3 | 11 |
| DES-C4 | 25 |
| DES-C5 | 2 |
| LANE-A | 31 |
| LANE-B | 30 |

## Dropped as answered (with the answering sentence)

| Source item | Answered by | Answering sentence (verbatim) |
|---|---|---|
| BL-Q3 (Sales By Representative Summary downloads) | SBR v28 S14-R5, S14-R15, S20-R8 | "S20-R8: The column selector state does not affect any export; all four downloads always include all metric columns, and both Expanded downloads always include Sales Type, whether or not it is shown on screen." The Summary column lists (S14-R5, S14-R15) have no Sales Type: option A, Summary unchanged. |
| BL-Q6 (Sales By Customer filter menu rows) | SBC v21 S3-R2 | "S3-R2: Its menu offers two options, each with a checkbox, "Part Sales" and "Service Sales", under a "Select all" row, with "Clear selection" at the bottom." |
| BL-Q8 (the field on a work order opened from its history) | SBR v28 S19-R1 | "The field is hidden on imported Work Orders and read-only in History mode." (agrees with PRD v8 S1-N1 and S2-R17: option A) |
| TP-Q10 (where "Sales Type column on" is remembered) | SBR v28 S23-R1, S23-N1 | "S23-R1: The report remembers, per browser, the user's filter and view settings: ... column visibility ..." and "S23-N1: Clearing browser storage returns the report to first-visit defaults (S23-R4). No server-side profile is kept." (option a, this browser only) |

Kept although "answered": **BL-Q7** (Assignments export headings). SBR v28 answers it (option B, keep "Rep is active?"), but PRD v8 S4-R23 says "Representative is active?", so it stays open as row 17.

## Notes on the merge

- "Suggested" is put first only where PRD v8 (14 Oct 2026) disagrees with an older document: Sales By Representative v28 (12 Oct), Sales By Customer v21 (6 Oct) or the Jira stories. Where the disagreement is with the tech plan (dated 14 Oct, re-checked 15 Oct) or the undated design, no option is marked suggested.
- Rows 3 and 4 (Lead Technician) are kept apart: one asks about a background note, the other about where messages go.
- Row 27 joins the empty-export questions for both reports (one decision, with option (c) if he wants them to differ).
- Row 37 refers to rows 1 and 9 by number; the script checks that those rows are the Jira 44 px and "Show Details" questions.
- Codes, ticket numbers and board numbers appear only in the grey "Where we found it" column (checked by script).
