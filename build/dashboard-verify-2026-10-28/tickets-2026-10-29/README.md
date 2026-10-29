# Ticket drafts for review, 29 Oct 2026 (epic SV-11839).

**Filed 29 Oct 2026 (QA lead's go-ahead):** P1-1 → SV-11931 · P1-2 → SV-11932 · P1-3 → SV-11933 · P1-4 → SV-11934 · D1 → SV-11935. Comments: SV-11931 (79711, tags Chris), SV-11823 (79712, P1-5), SV-11441 (79713, Q32). Record: `filed/FILED-2026-10-29.json`. **Every other draft is still unfiled.**

**Every draft waits for the QA lead's go-ahead, one ticket at a time (Rules 62 and 73).** When a draft is
approved it is filed as:

- type **Bug**, parent **SV-11839**, priority **Medium**, Product Area **Reports & Dashboards**;
- "relates to" the stories named in its header;
- the pictures listed in its header, uploaded and embedded in the description.

The basis is Chris Ward's answers of 28 Oct 2026. The verbatim copy is
`../chris-answers-2026-10-29/CHRIS-WARD-ANSWERS-verbatim.md`, and the impact map is
`../chris-answers-2026-10-29/ANSWERS-AND-DASHBOARD-IMPACT.md`.

Every finding was re-checked on staging build **v26.43.2-f8698cb** with three things set to the location's
own time zone, and all three recorded (Rule 99):

- the session;
- the browser;
- the test computer.

## Phase 1: Dashboard, and reports that change Dashboard figures (review these first)

| # | Draft | Title | Where it shows on the Dashboard |
|---|---|---|---|
| P1-1 | `phase1/P1-1-dashboard-tech-efficiency-declined-line.md` | Dashboard - Technician Efficiency counts a line the customer declined | Technician Efficiency tile headline, supporting line and table |
| P1-2 | `phase1/P1-2-reports-tech-efficiency-clock-under-36-seconds.md` | Reports - Technician Efficiency drops a line's tech time when the clock is under 36 seconds (Dashboard tile too) | Technician Efficiency tile headline and table |
| P1-3 | `phase1/P1-3-reports-tech-utilization-seconds-only-technician.md` | Reports - Technician Utilization lists a technician who clocked only a few seconds (Dashboard table too) | Technician Utilization tile table: an extra row; the figures do not change |
| P1-4 | `phase1/P1-4-reports-sales-by-customer-labor-delta-after-timesheet-edit.md` | Reports - Sales By Customer keeps the old Labor Delta after a timesheet is corrected (Dashboard table too) | Sales by Customer tile table, Labor Delta column |
| P1-5 | `phase1/P1-5-COMMENT-SV-11823-revenue-split.md` | **Comment, not a new ticket.** It records Chris's ruling on SV-11823, which is already open. | Revenue tile supporting line |

**Not tickets** (Chris answered "keep as today"): Revenue after a discount (draft F4 is withdrawn), and the
Technician Utilization decimals. Answers 11, 12 and 39 were checked and do not change any Dashboard figure.

Pictures are in `pictures/` (P1-*). Each one was looked at after it was annotated.

## Phase 2: reports that do NOT affect the Dashboard (review after Phase 1)

Four workers drafted these, following `phase2/PHASE2-WORKER-BRIEF.md`. Each one's summary file lists the check
times, the searches run and the test data it made: `phase2/SUMMARY-p2a.md` (labor), `phase2/SUMMARY-p2b.md`
(parts), `phase2/SUMMARY-p2c.md` (sales and tax) and `phase2/SUMMARY-p2d.md` (finance).

| # | Draft | Title | Relates to |
|---|---|---|---|
| A1 | `phase2/P2-A1-reports-wip-days-open-1-days.md` | Reports - Work In Progress shows "1 days" in Days Open instead of "1 day" | SV-8660 |
| A2 | `phase2/P2-A2-reports-wip-receive-later-parts-not-earned.md` | Reports - Work In Progress counts parts marked "Receive Later" as Parts Remaining instead of Parts Earned | SV-8660 |
| A4 | `phase2/P2-A4-reports-shop-efficiency-running-shift-left-out.md` | Reports - Shop Efficiency leaves a running timesheet out of Total Clocked Hours | SV-2116, SV-11688 |
| A5 | `phase2/P2-A5-reports-payroll-timesheet-overlap-counted-twice.md` | Reports - Payroll Timesheet export counts overlapping timesheets twice, so a day can show more than 24 hours | SV-2071 |
| B1 | `phase2/P2-B1-reports-parts-velocity-last-90-days-covers-91-days.md` | Reports - Parts Velocity "Last 90 days" covers 91 days | SV-11514, SV-8642 |
| B2 | `phase2/P2-B2-reports-parts-velocity-vendor-return-counts-as-units-returned.md` | Reports - Parts Velocity counts a return to the vendor in Units Returned | SV-8645 |
| B3 | `phase2/P2-B3-reports-parts-velocity-location-column-hidden-for-one-location.md` | Reports - Parts Velocity hides the Location column when one location is picked | SV-8642, SV-8643 |
| B4 | `phase2/P2-B4-reports-parts-velocity-last-sale-ignores-billed-sale.md` | Reports - Parts Velocity Last Sale ignores a billed sale that moved no stock | SV-8645, SV-11516 |
| B5 | `phase2/P2-B5-reports-inventory-value-qty-heading-should-be-on-hand.md` | Reports - Inventory Value quantity column is headed "Qty" instead of "On Hand" (screen and downloads) | SV-8670, SV-8677 |
| B6 | `phase2/P2-B6-reports-parts-velocity-receive-later-special-order-not-counted.md` | Reports - Parts Velocity shows a "Receive later" special-order part as never sold after it is invoiced | SV-8645 |
| B7 | `phase2/P2-B7-reports-parts-velocity-demand-counts-reinvoice-twice.md` | Reports - Parts Velocity Demand counts a work order twice when its invoice is reversed and created again | SV-8645 |
| B8 | `phase2/P2-B8-reports-inventory-value-margin-total-sell-shown-on-first-visit.md` | Reports - Inventory Value shows Margin and Total Sell on the first visit; they should start hidden | SV-8670, SV-8675, SV-8927 |
| C1 | `phase2/P2-C1-reports-sbr-labor-delta-after-timesheet-edit.md` | Reports - Sales By Representative keeps the old Labor Delta after a timesheet is corrected | SV-8626 |
| C2 | `phase2/P2-C2-reports-sales-tax-credit-memos-missing.md` | Reports - Sales Tax Collected leaves out credit memos, so their tax is not taken off the totals | SV-4573 |
| C3 | `phase2/P2-C3-reports-sales-tax-zero-invoices-listed-as-paid.md` | Reports - Sales Tax Collected lists $0.00 invoices as Paid, with a paid date | SV-4573 |
| C4 | `phase2/P2-C4-reports-sales-tax-deposit-part-paid-status-and-date.md` | Reports - Sales Tax Collected shows an invoice part paid by a deposit as Paid, with the invoice date as its paid date | SV-4573 |
| C6 | `phase2/P2-C6-reports-sbr-same-day-invoice-order.md` | Reports - Sales By Representative lists invoices on the same day newest first instead of by invoice number | SV-8624 |
| D1 **(FILED SV-11935)** | `phase2/P2-D1-reports-ar-aging-part-sale-deposit-not-taken-off.md` | Reports - A/R Aging shows an invoiced part sale at full amount; its deposit is not taken off | SV-5026, SV-11690 |
| D2 | `phase2/P2-D2-reports-ibs-sent-batch-total-not-sum-of-invoices.md` | Reports - IBS Batches: a sent batch's Total is $290.06 more than the invoices in it | SV-2144 |
| D3 | `phase2/P2-D3-reports-ibs-ready-to-send-lists-zero-invoice.md` | Reports - IBS Batches: a $0.00 invoice is listed in Ready To Send | SV-2144 |
| D4 | `phase2/P2-D4-reports-notes-shows-only-100-notes.md` | Reports - Notes shows only the first 100 notes, with no way to see the rest | parent epic SV-10193 (QA lead, 29 Oct) |
| D5 | `phase2/P2-D5-reports-qb-unexported-credit-memo-rows-blank-number.md` | Reports - QB Unexported: credit memo rows (and other credit and deposit rows) have a blank No. | SV-2871, SV-4929 |
| D6 | `phase2/P2-D6-reports-qb-unexported-credit-memo-listed-twice.md` | Reports - QB Unexported: one credit memo is listed twice, each time with a different error | SV-2871 |
| D7 | `phase2/P2-D7-reports-export-customer-invoice-terms-from-customer.md` | Reports - Export Reports: Customer Invoice shows the customer's current Terms, not the invoice's own | SV-1878, SV-11676 |

**Not drafted:**
- **A3** (Q11, a deleted work order showing on Timesheet Activities). A customer cannot reach this on screen:
  Delete is blocked once time has been clocked on a work order. The 5 old rows at Heavy Duty came from somewhere
  other than the screen.
- **C5** (TAX1). It is the same defect as C4, so it was merged into C4.

**Corrections to the question doc for Chris:**
- **Q39.** The figures for Admin Shopview (40.70 h and 32.34 h in one day) came from mismatched time zones. With the
  zones matched they are 7.70 h and 12.10 h. The defect itself is real: Haley Brown shows 28.50 h on 6 Sep, and the
  problem was re-created on screen.
- **Q38.** Those customers now have Net 30/50/60 terms. The export shows the customer's current terms, not COD.

## The time-zone lesson from 29 Oct (Rule 99 amendment)

The app keeps its own time zone in `localStorage['timezone']` and falls back to UTC when that is missing. All
Phase 1 pictures were re-taken with it set, and so were the Phase 2 pictures for B, C and D. The A1, A2 and A5
pictures were taken with it set; only A4 was not (see A4's header for why it is still correct).
