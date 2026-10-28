# ShopView — Dashboard and Reports full check · 28 Oct 2026

**Build:** staging `v26.43.2-f8698cb` (checked at start, after the container restart, and at the end) · **Role:** Admin · **Locations:** Staging Heavy Duty - 9919, Staging Lethbridge - 4310, QB Location, DVI Test · **TestRail:** not touched · **Jira:** nothing created.

Workbook with the same content: `ShopView-Dashboard-and-Reports-Full-Check-Findings-2026-10-28.xlsx` (Summary tab, one tab per outcome, PO questions).

## Checks run

| Area | Checks | Passed | Failed / held | Notes |
|---|---|---|---|---|
| Dashboard — self-consistency (17 figures × 4 locations × 16 date ranges) | 1,185 | 1,181 | 4 | 4 = API accepts 367 days; picker blocks it (Rule 24 pass) |
| Dashboard — tile equals its report | 2,592 | 2,592 | 0 |  |
| Dashboard — recompute from raw invoices / lines / clocks | 53,748 | — | — | all pass except F2, F3 (API-only), 4 × 1-cent rounding |
| Dashboard — screen equals server, expanded panels, chart filters | 1,314 | 1,314 | 0 |  |
| Dashboard — seeded known data (12 scenarios) | 12 | 8 | 4 | F2, F4 held; F3, F5 API-only |
| Work In Progress | 246,694 | 246,675 | 19 | Days Open (WIP-D1, held) |
| Technician Utilization | 3,028 | 2,739 | 134 | SV-11688 open clocks; decimals (TU-D2, held) |
| Timesheet Activities | 119,979 | 119,892 | 51 | all = SV-10698 / SV-10701 or deleted-WO clocks |
| Parts Velocity | 2,034,770 | 2,034,573 | 197 | 168 = PV-D1; rest explained (deleted parts PQ-6, collation, inconclusive slices); seeded data → PV-D1, PV-D2 |
| Inventory Value | 800,233 | 800,226 | 7 | collation / unrounded ties — invisible on screen |
| A/R, A/P, IBS, QB Unexported, Exports, Notes, Reminders | 824 | 756 | 68 | 1 ready, 4 held, 2 known |
| Sales By Customer | 144,175 | 129,838 | 14,337 | mostly spec-vs-ticket label/date-basis rows (SQ-1, SQ-4, SQ-10) |
| Sales By Representative | 147,584 | 146,093 | 1,491 | 277 = rep changed after invoicing (correct); SV-8974; SQ-3 |
| Sales (remaining columns) | 97,250 | 96,171 | 1,079 | every failure matches the invoice record (Stats tab changed later) |
| Service Advisor Analysis | 113,291 | 112,690 | 601 | as Sales |
| Technician Efficiency (both tabs) | 1,089,952 | 1,089,118 | 834 | F2 declined lines (101); tiny clocks (SQ-6) |
| Sales Tax Collected (2 passes) + void + filters | 582,213 | 563,613 | 18,074 | TAX1 ready; pass-1 status failures replaced by pass 2 |
| Follow Up (hidden) | 12 | 0 | 12 | server error every read (SQ-5) |

## Ready to file (4)

Passed every admissibility check. Waits only for your go-ahead, one ticket at a time.

| # | Report / tile | What is wrong | Written source | PO question | Draft |
|---|---|---|---|---|---|
| AP1 | A/P Aging Detail · A/P Unpaid Invoices | Past Due is one day short for every bill not yet due (due tomorrow shows 0, due in 10 days shows -9). | AP reports PRD, Confluence 265093124 v13 (2026-03-18) | — | `reports/W4-finance-accounting-comms/defects/TICKET-AP1-ap-past-due-one-day-short.wiki` |
| PV-D1 | Parts Velocity | A special-order part billed with "Receive later" shows 0 sold, $0.00 revenue and Demand 0. | Parts Velocity spec, Confluence 620888066 v12 (2026-09-14) | — | `reports/W3-parts/defects/TICKET-D1-pv-receive-later-special-order-not-counted.wiki` |
| PV-D2 | Parts Velocity | Demand counts a work order twice after the invoice is reversed and created again. | Parts Velocity spec, Confluence 620888066 v12 (2026-09-14), S5-R4 | — | `reports/W3-parts/defects/TICKET-D2-pv-demand-counts-reinvoice-twice.wiki` |
| TAX1 | Sales Tax Collected | An invoice part-paid by a deposit shows Invoice Status "Paid", and the "Partially Paid" filter leaves it out. | SV-4573 (Done): "Invoice Status (, Partially Paid, Paid)" — quote re-read live by coordinator | — | `reports/W2-sales-advisor-tax/defects/TICKET-W2-6-sales-tax-status-deposit-paid.wiki` |

## Held for PO (16)

Draft written. The written source is silent or can be read two ways, so the PO answers first.

| # | Report / tile | What is wrong | Written source | PO question | Draft |
|---|---|---|---|---|---|
| F2 | Technician Efficiency tile (and report) | Technician time on lines the customer declined still counts in "Invoiced Tech Hrs". | Dashboard PRD v53, Confluence 788430850 (2026-10-22) | DQ-1 | `defect-pack-2026-10-28/TICKET-F2-tech-efficiency-counts-declined-lines.wiki` |
| F4 | Revenue tile (and Sales report) | Revenue is after a work-order discount; the PRD says "before any discount". | Dashboard PRD v53, Confluence 788430850 | DQ-2 | `defect-pack-2026-10-28/TICKET-F4-revenue-after-discount.wiki` |
| WIP-D1 | Work In Progress | "Days Open" counts calendar dates: a work order 10 hours old shows "1 days" (spec: whole 24-hour periods). | WIP spec, Confluence 703660034 v28 (2026-08-24), S4-R12 | WQ-1 | `reports/W1-labor-wip/defects/TICKET-W1-D1-wip-days-open-calendar-days.wiki` |
| TU-D2 | Technician Utilization | Utilization % shows two decimals (85.71%); the spec says one (85.7%). | TU spec, Confluence 641400833 v9 (2026-08-13), S2-R7 | WQ-2 | `reports/W1-labor-wip/defects/TICKET-W1-D2-tu-utilization-two-decimals.wiki` |
| WIP-D3 | Work In Progress | Negative amounts show as "(-$3.13)"; the spec shows "-$1,234.56". | WIP spec v28, S4-R14 | WQ-3 | `reports/W1-labor-wip/defects/DEFECT-CANDIDATE-wip-negative-amounts-in-brackets.md` |
| AR1 | A/R Aging Collection | A credit created on the chosen date is listed as 1 day past due; the PRD says 0-day items are not shown. | AR PRD, Confluence 82083852 v25 (2026-02-19) | RQ-1 | `reports/W4-finance-accounting-comms/defects/TICKET-AR1-ar-collection-same-day-credit.wiki` |
| DEP1 | A/R Aging | A deposit on an invoiced part sale is not taken off the part sale's balance in A/R Aging. | AR PRD v25 / SV-11690 | RQ-2 | `reports/W4-finance-accounting-comms/defects/DEFECT-CANDIDATE-ar-aging-part-sale-held-deposit.md` |
| IBS1 | IBS Batches · Sent | A Sent batch Total ($9,473.35) is not the sum of its 9 invoices ($9,183.29). | No PRD (Jira SV-2144) | RQ-3 | `reports/W4-finance-accounting-comms/defects/TICKET-IBS1-sent-batch-total-not-sum-of-invoices.wiki` |
| NOTES1 | Notes Report | The Notes Report never shows more than 100 notes, with no way to see the rest. | No written source | RQ-4 | `reports/W4-finance-accounting-comms/defects/TICKET-NOTES1-notes-report-stops-at-100.wiki` |
| SBC1 | Sales By Customer | Margin % divides by Subtotal minus Shop Supplies; the SBC and SBR specs disagree on the base. | SBC spec Confluence 577634305 v22 (2026-10-19) vs SBR spec 585629698 v30 §3 | SQ-1 | `reports/W2-sales-advisor-tax/defects/TICKET-W2-1-sbc-margin-percent-base.wiki` |
| DEC1 | SBC / SBR / Sales | Labor Delta and Margin % show 2 decimals (specs say 1); negative money shows "(-$2.50)". | SBC v22 / SBR v30 | SQ-2 | `reports/W2-sales-advisor-tax/defects/DEFECT-CANDIDATE-labor-delta-and-margin-decimals.md` |
| SBR2 | Sales By Representative | A $0.00 invoice nobody paid shows "Paid". | SV-9217 vs SBR spec v30 §3 | SQ-3 | `reports/W2-sales-advisor-tax/RESULTS.md` |
| FU1 | Follow Up (hidden page) | The hidden Follow Up page is blank and its data request fails (server error) on 12 of 12 reads. | No written source | SQ-5 | `reports/W2-sales-advisor-tax/defects/TICKET-W2-5-follow-up-report-server-error.wiki` |
| TE1 | Technician Efficiency | A clock shorter than 0.01 h drops the line's whole technician time. | see candidate | SQ-6 | `reports/W2-sales-advisor-tax/defects/DEFECT-CANDIDATE-te-tiny-clock-drops-tech-time.md` |
| DATE1 | SBC / SBR date options | The date options on screen match neither spec. | SBC v22 / SBR v30 | SQ-7 | `reports/W2-sales-advisor-tax/defects/DEFECT-CANDIDATE-date-filter-options.md` |
| TAX2 | Sales Tax Collected | Unpaid invoices are not listed; credit-memo tax handling; $0.00 invoices listed "Paid" with no payment (643); deposit invoices dated by invoice not deposit (20). | SV-4573 | SQ-8, SQ-9, SQ-11 | `reports/W2-sales-advisor-tax/RESULTS.md` |

## Already reported (8)

Already in Jira and still happening on this build. Not filed again.

| # | Report / tile | What is wrong | Written source | PO question | Draft |
|---|---|---|---|---|---|
| F1 | Technician Utilization | Never-clocked-out timesheets count as 24 h a day. | SV-11688 (Ready to Fix) | — | `defect-pack-2026-10-28/NOT-FILED.md` |
| TA-N4 | Timesheet Activities | Rows do not add up to the footer when a clock has run since an earlier day. | SV-10698 (Blocked) | — | `reports/W1-labor-wip/defects/NOT-FILED.md` |
| TA-N5 | Timesheet Activities | On a daylight-saving day a 23-hour day row reads 24.00 h. | SV-10701 (Blocked) | — | `reports/W1-labor-wip/defects/NOT-FILED.md` |
| AR-L2 | A/R Aging | 4 invoices open in A/R but settled on the customer account. | SV-11691 (In Progress) | — | `reports/W4-finance-accounting-comms/RESULTS.md` |
| PV-K1 | Parts Velocity | Vendor/Category never show "Multiple" on multi-vendor rows. | SV-10080 (Code Review, not on staging) | — | `reports/W3-parts/RESULTS.md` |
| IV-K1 | Inventory Value | Negative bins are ignored. | SV-10380 (Testing QA, fix not on staging) | — | `reports/W3-parts/RESULTS.md` |
| AR-K2 | A/R & A/P (all six) | Rows in no set order; Totals ignore the Customer/Vendor filter; label wording. | SV-11315 epic (Ready for Development) — scheduled | — | `reports/W4-finance-accounting-comms/RESULTS.md` |
| SALES-K1 | Sales | Margin shows "N/A" when parts are $0. | SV-6147 (open) | — | `reports/W2-sales-advisor-tax/RESULTS.md` |

## QA lead decision (4)

Raised before, closed as Obsolete, still on screen. You decide whether to reopen.

| # | Report / tile | What is wrong | Written source | PO question | Draft |
|---|---|---|---|---|---|
| IV-O1 | Inventory Value | First visit shows Margin and Total Sell (spec: hidden by default). | SV-8927 (closed Obsolete) | Reopen? | `reports/W3-parts/RESULTS.md` |
| IV-O2 | Inventory Value | Totals row reads "Totals" (spec: "Total"). | SV-8926 (closed Obsolete) | Reopen? | `reports/W3-parts/RESULTS.md` |
| IV-O3 | Inventory Value | Empty-state wording differs from the spec; header "Qty" vs "Qty on Hand". | SV-8930 (closed Obsolete) | Reopen? | `reports/W3-parts/RESULTS.md` |
| SBR1 | Sales By Representative | Invoices on the same day are not ordered by invoice number. | SV-8974 (closed OBSOLETE 9 Aug 2026 without a fix) | Reopen? | `reports/W2-sales-advisor-tax/defects/DEFECT-CANDIDATE-sbr-same-day-invoice-order.md` |

## Not a ticket (4)

Only reachable through the API (screen blocks it, Rule 24), or rounding / observation.

| # | Report / tile | What is wrong | Written source | PO question | Draft |
|---|---|---|---|---|---|
| F3/F5 | Billing Efficiency / Sales | Lines added to Paid/Invoiced work orders after invoicing change hours and the pending invoice. | — | — | `defect-pack-2026-10-28/NOT-FILED.md` |
| W1-N1/N2 | WIP / Shop Efficiency | Fixed price + hourly rate valued at hours × rate; void invoice hours counted. | — | WQ-9 | `reports/W1-labor-wip/defects/NOT-FILED.md` |
| SBC2 | Sales By Customer | Asset label follows SV-9459, not spec S8-R7; SBC/SBR differ from today's Stats tab after later clocks or credits. | SBC v22, SV-9459 | SQ-4, SQ-10 | `reports/W2-sales-advisor-tax/RESULTS.md` |
| O4-W2 | Customer payment window | Void invoice S1-38207 still shows $135.00 owing in New Customer Payment; work order stays "Invoiced". | — | — | `reports/W2-sales-advisor-tax/RESULTS.md` |
