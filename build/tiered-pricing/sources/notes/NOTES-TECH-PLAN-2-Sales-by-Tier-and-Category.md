# Running notes — Tech plan 2 "Sales by Tier and Sales by Category — Technical Implementation Plan" (221,613 bytes, 1,933 lines)

Read in sequential chunks, 14 Nov 2026 (Rule 119). Built on reports PRD page version 21 = today's page; parent PRD page 37.

## Lines 1-70 (header, execution state, baseline, revision history) — read directly
- Product rounds RQ1-RQ3, RQ6-RQ9 (page 18), RQ10-RQ13, RQ15-RQ16 (page 20), RQ17 (page 21) answered; RQ14 dropped. "Nothing is left before implementation."
- Round 3 (RQ17): only credits WITH part lines count; withdrew line-less (goodwill) credits, the proportional split, reversal rows, the "Credits not tied to a part" row and its Priced By option. The reports PRD v21 change log still shows the earlier (withdrawn) rows dated 10-11 Nov — history only; the requirement text is current.

## Lines 71-217 (Section 1 requirements) — 69 lines proved identical to PRD text by script; 55 residual lines read directly
- Residual: PRD framing quotes (identical in substance), plan-assigned ids RPT-S1-EH1, RPT-S2-EH1, RPT-S4-EH1, RPT-S5-EH1 and RPT-UF1..UF6 (User Feedback rows), NFR-R1..R6, clarifications (DQ2/5/7, RQ1-RQ17 answers).
- NFR-R2: speed bar "no slower than Sales by Customer" (median of 5 warm runs, prod replica) — engineering measurement, not manual-testable (excluded with reason; a manual tester can only compare felt load time).
- NFR-R3: Totals Parts Invoiced = SBC parts_invoiced; Parts Cost = Σ invoice.parts_cost; Parts Margin = SBC Σ(parts_sell − parts_cost); no Sales-report comparison.

## Lines 218-405 (Sections 2-9) — read directly
- R-D4: Sales Type from the invoice-number prefix exactly as Sales by Customer ("Part Sales" = parts prefix, "Work Orders" = service).
- R-D12: a part line on several invoices (voided then reissued) — its credit goes to the latest non-void invoice's row.
- R-D13: the Customer filter's type-ahead also finds a customer whose only activity in the range is a credit with part lines (SBC's search can't) — tech-plan behaviour, testable.
- R-D14: CSV numbers plain "-12.40"; PDF "−$12.40"; other reports' exports unchanged.
- R-D16 (design page 20 points): over-a-year message "Choose a date range of one year or less." (20.11); Location chip not clearable (20.9); "Clear All Filters" (20.24); column choice remembered PER REPORT (20.16); closed chips "All", X restores All (20.2); negative percentages "−4.20%"; % of Total 2 decimals; documents oldest first (20.4, replaces SBC's newest first); "Multiple" for a row/Priced For spanning several; a sort change closes open rows (as SBC); Priced By A-Z by shown label.
- R-D18: imported historical invoices living in `invoice` with no part rows -> one Before tiers row per invoice (Phase 2 to verify).
- R-D19: a credit on a line whose invoice was reversed reads the line's own recorded pricing; NULL -> Before tiers; deleted category -> Uncategorized.
- R-D29: document row "Invoice 10510 · Oct 2, 2026" / "Credit CM-5003 · Oct 21, 2026"; no Date column on screen; Expanded download keeps "Date"; a credit row's "Invoice #" = its credit number; date "MMM d, yyyy" in the workplace time zone.
- R-D30: the fixed-line-total amount SBC counts = stored parts amount, except (a) no quantity-1 part -> leftover cent to labor, parts one cent less; (b) older lines with no stored portions count the whole total as labor and parts $0.
- R-D31: SBC's current download headers: "Customer", "Invoice #", "Date", "Location", "Parts Invoiced", "Parts Margin", "Margin %", "Totals" (V1 fact). These reports use "Parts Margin %".
- R-D32: download header lines and all-wording ("Category: All categories", "Priced By: All", "Customer: All customers", empty pick "None", lists comma-separated in filter order). DESIGN 20.21 shows Priced By BEFORE Category; the plan follows the PRD order (Sales Type, Category, Priced By, Customer) -> a design-vs-PRD difference (Rule 130) for the design worker's divergence register; candidate PO question Q4.
- R-D33: first click on Parts Credits puts the largest credit on top (descending by magnitude).
- R-D36: only credits with part lines.
- Section 5: Location column "Multiple" when a row spans several locations; a credit's PDF opens via the existing credit PDF (needs invoice view); "No existing endpoint changes" -> Sales by Customer unchanged.
- Section 7 manual checklist (4 items): SBC = SBT to the cent; goodwill credit in neither report; Part Sale return counts on the credit date; unapplied return counts on the credit date.
- Section 9 security: cost and margin to any report user (TP-S16-R7); CSV-injection guard on every text cell.

## Lines 406-644 (Section 10 traceability) — every row parsed by script and reviewed: 124 pointer-only rows, 19 rows with a combined appendix pointer, 86 annotated rows read in full. No new behaviour beyond Sections 1-9.

## Lines 645-666 (Section 11) — matches Jira SV-12745..SV-12755 (owner Stefan Vukovic).

## Lines 667-1347 (Appendix A backend design) — read directly; superseded where noted at its head (branch U, unlinkedCredits withdrawn).
- TODAY (V1 evidence): the Sales report's Parts Cost nets out returned parts' cost on credit rows, counts each WO's cost once on its newest invoice, covers only the active location (so these reports can't tie to it). One payment applying several credits to several invoices stores no per-credit split. SBC drill-downs fetch everything, collapse and toast on failure. Every other report's export cap is 10,000 rows with its own message (unchanged); other reports show negatives as "(-$45.00)" in Display style and "-45.00" in Spreadsheet style (unchanged). The "Empty export" notice is front-end only (SalesByCustomerReport). Non-void credit statuses: open, partially_applied, fully_consumed, closed_via_refund.
- Credit amount = ROUND(quantity x sell price) − restocking fee (pre-tax); attribution excludes core_credit rows; the credit's Sales Type comes from the attributed invoice's number.
- Location shown as a name, "Multiple" or "".
- Tie-out audit checks: SELL_MISMATCH, COST_MISMATCH, MISSING_ROWS, SNAPSHOT_NULL (SBC shows 0), FIXED_LINE_TOTAL, CREDIT_LINE_UNATTRIBUTED.
- Regression list (invariants): every report export (PV, IV, SBC, SBR, TU, WIP) default cap 10,000 and its message; over-cap toasts (WIP/IV "FiltersOnly" wording); all six reports' PDF/CSV figure styles; report scope validation for every report.
- Backfill must never re-run the invoice financial snapshot (would change Sales by Customer's history) -> invariant: SBC history unchanged after release.

## Lines 1348-1903 (Appendix B frontend design) — read directly
- TODAY (V1 evidence): Reports nav sends no query, so filters do not carry between reports today (kept for every other pair; "going from Parts Velocity carries nothing"). FilterChip active = any value; summary "All <noun>". Multi-select panels do not focus their search box today. The 50-value cap is order-sensitive today (re-ticking a full set in a different order on a >50-option filter is refused) — the fix is in shared FilterBar/MobileFilterChipRow normalisation behind an opt-in flag (risk to ~70 filter bars). "Sales Type: None"-style empty selections can't survive reload in SBC ("No products") — unchanged there. The suite's shared download-failure text is "This report is too large to export. Narrow the date range or filters…" (unchanged for other reports). "There are no results for selected date range" exists today only on Shop Billing Efficiency. Report nav gate = 'Reports — Page Access' (parent route).
- Link gating as SBC: a work order invoice links only with See Financial Data; a Part Sale only with Part Sales view permission; same location required; credits need invoice view.
- FE §6 ambiguities, now settled by R-D16/R-D29 from design: A1 Clear All Filters; A2 over-a-year message; A9 Location non-clearable; A10 CSV ASCII minus; A11 2 decimals; A12 per report; A14 no "(n)" count suffix and no expand-all control (omitted; design decides); A15 sort change closes rows.

## Lines 1904-1933 (Appendix C) — the RPT-S1-R7 list is EMPTY (to be filled from the staging audit before merge and signed off by Matt Barge and the report-standard owner). Until then the list of invoices whose part lines don't add up is unknown -> outstanding (numbers verdicts on historical data depend on it).

## Reading coverage — tech plan 2: lines 1-1933 of 1933 = 100% (Section 1: 69 lines script-proved identical + 55 residual read; Section 10 rows parsed and every annotated row read; all else read directly).
