# W2 — Sales By Customer, Sales By Representative, Sales, Advisor Analysis, Technician Efficiency, Sales Tax Collected, Follow Up

**Build:** staging `v26.43.2-f8698cb`, read from the page's `app-version` meta on every screen capture. I checked it again after the container restart and it had not changed. **Date of run:** 28 Oct 2026, 19:40–21:50 UTC. **Pass type:** FULL. Every column, total, filter and date option was checked for every invoice in every range. Nothing was sampled.
**Scope of data:** 4 locations: Staging Heavy Duty - 9919 (Asia/Karachi), Staging Lethbridge - 4310 (America/Edmonton), QB Location (America/Vancouver) and DVI Test (America/Toronto). 16 date windows per location: every preset plus custom windows of 1, 31, 32, 182, 183, 366 and 367 days. Each window is worked out in the location's own time zone.
**Oracle:** each figure was recomputed independently from the record it describes:
- the invoice itself (`/api/invoices/{id}/view`)
- the work order's Stats tab (`/api/work-orders/statistics/{wo}`)
- the work order's payments and deposits (`/api/work-orders/view/{wo}`)
- the clock records (`/api/work-orders/lines/{wo}`)
- the customer's sales rep.

The report's own numbers were never used to check themselves. Expectations come only from the written sources named below.
**Nothing was written to TestRail and no Jira ticket was created.** Jira and Confluence were only read.

**Raw check rows:** the full rows are kept outside the repo because of their size, at **`/tmp/cln/w2/full/results-*.json`** (te 373 MB, tax 139 MB, sbc 44 MB, sbr 43 MB, tax-status 38 MB, saa 32 MB, sales 28 MB). The repo copies `results-*.json` are compact summaries. Each one holds the counts for every check and every non-PASS row, capped at 300 per check, with the cap stated. They are produced by `tools/compact.py`.

## Totals

| Report | Check rows | PASS | FAIL | Of the FAILs: findings | Of the FAILs: explained (not defects) |
|---|---|---|---|---|---|
| Sales By Customer | 144,175 | 129,838 | 14,337 | Margin % base 6,464 (HELD SQ-1); asset label vs spec 7,293 (spec stale, SQ-4) | 558 frozen-vs-live (SQ-10), 19 rounding, 3 single-record |
| Sales By Representative | 147,584 | 146,093 | 1,491 | same-day order 8 (SV-8974); $0 badge 645 (HELD SQ-3) | 277 rep reassigned later, 558 frozen-vs-live (SQ-10), 3 single-record |
| Sales | 97,250 | 96,171 | 1,079 | — | 1,079: all match the invoice record (Stats tab changed later) |
| Service Advisor Analysis | 113,291 | 112,690 | 601 | — | 601: all match the invoice record |
| Technician Efficiency (both tabs) | 1,089,952 | 1,089,118 | 834 | tiny clocks 727 (HELD SQ-6); declined lines 101 (= F2, cited) | 5 my own seeding, 1 observation |
| Sales Tax Collected, pass 1 | 491,930 | 479,522 | 12,408 | — | superseded by pass 2 for status and paid date; the rest explained below |
| Sales Tax Collected, pass 2 (status and paid date, fresh oracle) | 89,490 | 83,298 | 5,666 (+334 DEPOSIT, 192 INFO) | **deposit part-paid shown Paid: 9 invoices + 2 fresh → ADMISSIBLE**; $0 invoices 428 (SQ-11) | 5 old data, 2 duplicate-number |
| Void exclusion (all reports) | 14 | 14 | 0 | — | — |
| All-locations / Customer filter | 8 + 771 | 779 | 0 | — | — |
| Follow Up (hidden) | 12 reads + screen | 0 | 12 | HTTP 500, blank page (HELD SQ-5) | — |
| **All** | **2,174,477** | **2,137,523** | **36,428** (+526 DEPOSIT / INFO rows) | | |

## 1 · Sales By Customer

**Source:** Confluence 577634305 "Sales By Customer" **v22, 2026-10-19** (`sources/SBC-577634305.md`). The SBR spec v30 §3 is also used, because it states SBC's Margin % base. Jira: SV-9071, SV-9459, SV-9068, SV-9069.

PASS on every invoice, range, sales type and location:
- void and reversed invoices left out (S7-R7)
- invoice date
- Labor, Parts and Shop Supplies taken from the invoice (line-level fees and discounts folded in, S7-R17)
- Subtotal, Adjustments and both row tie-outs (S7-R18)
- asset rows and customer rows add up, with correct (n) counts (S8-R13, S7-R3)
- assets sorted A–Z with "Parts Sales" last (S8-R6/R6a), and the no-vehicle bucket (S8-E3)
- sales type by S/P prefix
- the customers listed, each customer row, the Totals row, and Totals and customer Margin % recomputed rather than averaged, for each of All / Parts / Service / none (S7-N1, S3-R5/R6/R6a, S18-R6)
- all-locations equals the per-location sums, and "Multiple" in the Location column
- the Customer filter, one by one for all 425 customers, and with two customers together.

| Check | Result | What it means |
|---|---|---|
| Margin % = Margin ÷ Subtotal (S7-R11, Terminology) | 1,559 PASS / 6,483 FAIL | **6,464** rows that carry shop supplies use Margin ÷ (Subtotal − Shop Supplies), which is what SBR v30 says SBC does. The two specs disagree → **HELD, SQ-1**, `defects/DEFECT-CANDIDATE-sbc-margin-percent-base.md`, ticket drafted. The other **19** come from my 1-decimal comparison against the build's 2 decimals (e.g. S2-34972 40.05 vs 40.1) → part of SQ-2. |
| Margin % = Margin ÷ (Subtotal − Shop Supplies) | 8,041 / 1 | S2-6365 80.04 vs 80.03, last-digit rounding |
| Asset label per spec S8-R7..R10 (VIN first) | 390 / 7,293 | The build follows **SV-9459** (Unit # - Year Make Model, VIN as fallback): **7,683 / 0**. The spec has not caught up → SQ-4, not a defect |
| Labor Delta = hours invoiced − hours worked (today's Stats tab) | 7,658 / 370 | Every one is an invoice where time was clocked after invoicing (mostly the automated-test customer TestVT1) → SQ-10. The build shows 2 decimals where the spec says 1 → SQ-2 (`DEFECT-CANDIDATE-labor-delta-and-margin-decimals.md`) |
| Labor Margin / Parts Margin vs today's Stats-tab cost | 7,909 / 119 · 7,959 / 69 | Costs changed or parts were credited after invoicing (e.g. P2-2436) → SQ-10 |
| Subtotal, Adjustments | 8,041 / 1 each | S2-5329: the invoice record itself is $10.00 out (lines and fees do not add up to its subtotal) → observation O5 |
| Date options (S2-R2) | listed separately | The screen shows the suite's 10 options and neither spec's list → **HELD, SQ-7** (`DEFECT-CANDIDATE-date-filter-options.md`). Every window itself is correct |

## 2 · Sales By Representative

**Source:** Confluence 585629698 "Sales By Representative" **v30, 2026-10-21** (`sources/SBR-585629698.md`). Jira: SV-8974, SV-9217, SV-9199, SV-9200, SV-10890.

PASS:
- Unassigned row pinned first, then reps A–Z
- rep row = sum of its invoices, with (n); contributors only
- the (Inactive) tag
- each invoice listed exactly once, under one rep
- void left out
- all money columns and both tie-outs
- Margin % on the margin base
- Labor Delta from the row's own fields
- **Invoice Status filter**: All, Paid, Partially Paid, Unpaid, and "Paid,Unpaid"
- **Show Unassigned** off and on: the Totals row includes Unassigned only when it is switched on (S22-R6)
- the product-type filter: All, Parts, Service, none
- Totals Margin % recomputed
- the seeded rep test: S1-38210 was credited to Viktoria Videnovic even after the work order's rep was changed to Ahtasham Admin. This is the snapshot rule, **PASS**.
- The status badge follows the SV-9217 rule: 8,042 / 0.

| Check | Result | What it means |
|---|---|---|
| Same-day invoices ordered by invoice number (S6-R9) | 16 / 8 | **ALREADY REPORTED, SV-8974** (closed OBSOLETE on 9 Aug in a bulk sweep, never fixed). Reproduced on screen twice (20:28 and 21:07 UTC) → `DEFECT-CANDIDATE-sbr-same-day-invoice-order.md`, picture `SBR-1-same-day-order.png`. Needs re-opening, not a new ticket |
| Status badge per §3 ($0 invoice with no payment = Unpaid) | 7,397 / 645 | SV-9217 (Done 26 Aug) made these read **Paid** → **HELD, SQ-3** |
| Invoice credited to the work order's rep, else the customer's | 7,765 / 277 | The rep on the work order or customer was changed after invoicing. The invoice keeps the rep it had when it was made ("Snapshot … Immutable on past invoices"). The seeded test proves this rule → not a defect |
| Hours worked / hours invoiced vs today's Stats tab | 7,660 / 368 · 8,026 / 2 | Clocks added after invoicing → SQ-10 |
| Labor Margin / Parts Margin vs today's Stats tab | 119 / 69 | Same as SBC → SQ-10 |
| Subtotal, Adjustments, Margin % | 1 each | S2-5329 (O5); S2-6365 rounding |
| Labor Delta decimals; negative money shown "(-$2.50)" vs §3 "($1,234.56)" | seen on screen | → SQ-2 |
| Split-rep Sales Type (SV-10890 / the Splitting Sales Representatives PRD) and the "Sales Type" filter wording | **NOT BUILT YET** | The build has a single rep per invoice and the "Product type" wording. Not checked further |

## 3 · Sales report (remaining columns)

**Sources (no Confluence spec page exists; these Jira stories are the written source):**
- SV-2107 Sales report enhancements
- SV-2463 ("It needs to match the statistics tab")
- SV-3584
- SV-5308 / SV-5314 Credit on Sales report
- SV-6101
- SV-6344 (Parts Cost = work order Stats)
- SV-6147 (open)
- SV-7036
- SV-10892

Files are in `sources/jira/`. Confluence CQL `title ~ "Sales report"` found only the Dashboard PRD and the Report Suite pages.

| Check | Result |
|---|---|
| Inv. Hrs = billed hours on the Stats tab | 8,022 / 0 |
| Hours worked behind Billing Efficiency = clocked hours on the Stats tab | 8,022 / 0 |
| Billing Efficiency = Inv. Hrs ÷ clocked × 100; N/A when nothing is clocked | 8,022 / 0 |
| Labor cost, Labor Margin % | 8,022 / 0 each |
| Parts Cost = Stats-tab parts cost (SV-6344) | 8,022 / 0 |
| Parts Margin %, Profit = labor profit + parts profit, Margin % | 8,022 / 0 each |
| Labor Invoiced / Parts Invoiced / Profit vs **today's** Stats tab | 7,438 / 584 · 7,937 / 85 · 7,612 / 410. **Explained:** a follow-up check (`tools/check_sales_vs_invoice.py`) found that **all 663 invoices behind these failures match their own invoice record exactly**. The Stats tab has changed since, through lines added or credits after invoicing. The invoice is the authority → not a defect (same question as SQ-10) |
| Credit memo rows: negative Parts / Subtotal, Profit reverses, no hours or labor, credit number with no WO link, Parts Margin sign | 156 / 0 each |
| Rows inside the dates; Totals row = sums; Totals % recomputed, not averaged | 64 / 0 each |
| Work order with no lines → all zeros | 14 / 0 |
| Customer filter | 771 / 0 |
| **"Inv. Hrs from the newest invoice"** | **NOT APPLICABLE / NOT VERIFIED.** No work order in the 4 locations has two live invoices, and the product refuses line changes on an Invoiced work order. The only way to get a second invoice is a void (S1-38207), which drops the first one. The rule cannot be exercised |
| "(No company)" row | **NOT VERIFIED.** No invoice without a company exists in any location |
| Margin "N/A" when Parts Invoiced is $0.00 | **ALREADY REPORTED, SV-6147** (open). Not re-raised |

## 4 · Service Advisor Analysis

**Sources:** SV-2108, SV-2489, SV-2817, SV-9200 (Labor Delta rename), SV-10893. There is no Confluence spec page (same CQL).

| Check | Result |
|---|---|
| Rows inside the dates; each work order once; every row has an advisor | 64 / 0 each |
| Lines = lines not declined | 7,525 / 0 |
| Labor Delta = Hrs Invoiced − Hrs Worked; Hrs Worked and Hrs Invoiced = Stats tab | 7,525 / 0 each |
| Billing Efficiency; ELR = labor sold ÷ hours clocked | 7,525 / 0 each |
| Parts Cost, Parts Profit, Parts Margin, Total Profit, Total Margin | 7,525 / 0 each |
| Subtotal = the invoice subtotal | 7,525 / 0 |
| Days Open = days from work order start to invoice, rounded up | 7,525 / 0 |
| Totals row = sums; Totals % recomputed | 64 / 0 each (the totals cover the full set on every page) |
| Advisor filter: only that advisor's rows; Totals = that advisor only | 41 / 0 each (every advisor who has rows) |
| Labor billed / Parts Invoiced vs today's Stats tab | 6,941 / 584 · 7,508 / 17. **Explained:** all 595 invoices match their own invoice record |

## 5 · Technician Efficiency (Invoiced tab and Completed tab)

**Sources:**
- SV-2115 (report-five)
- SV-5298 / SV-5450 'Completed' Technician Efficiency
- SV-5871
- SV-5956 (rounding)
- SV-6114
- SV-6273 (Completed date filter).

**Cited, not redone:** declined lines counted = **finding F2** from the dashboard pass (`../../defect-pack-2026-10-28/DEFECT-CANDIDATE-tech-efficiency-counts-declined-lines.md`, HELD with DQ-1). This report shows the same cause: **101 rows on 18 lines**.

| Check | Result |
|---|---|
| Summary technicians = expanded technicians (both tabs) | 64 / 0 each |
| Technician Clocked Hrs and Tech Hrs = sum of their lines; Hrs Profit; Efficiency (0 when under 0.01) | 364 / 0 (Invoiced), 389 / 0 (Completed) each |
| Invoice date / Completed date inside the dates (location time zone) | 90,239 / 0 · 90,890 / 0 |
| Clocked Hrs on the line = that technician's clock records | 90,239 / 0 · 90,890 / 0 |
| Line Efficiency and Hrs Profit follow from the line's hours | 90,239 / 0 · 90,890 / 0 |
| Completed tab: only Complete lines, and the technician has clocked time on them | 90,890 / 0 each |
| Lines listed = every clocked, not-declined line of the invoiced work orders | 64 / 0 (declined lines excluded from the expected set, as F2) |
| **Tech Hrs = the technician's proportional share of the line's tech time** | 89,892 / 347 · 90,510 / 380 → **727 rows on 221 lines**. When a technician's clocks on a line total less than 0.01 h, the line's whole tech time is dropped (e.g. S3-15255: 30 min tech time, 12 s clocked → 0.00). **HELD, SQ-6**, `DEFECT-CANDIDATE-te-tiny-clock-drops-tech-time.md`, picture `TE-1-tiny-clock-line.png` |
| Line is not a declined line (Invoiced tab) | 90,138 / 101 → **F2** (cited) |
| Preset by name = custom window of the same dates | 36 / 0 and 31 / 5. The 5 are DVI Test windows that my own clock records landed in between the two reads → harness timing, not a defect |
| Every Complete line with clocks appears in a Completed window | 3 / 1. One line on S2-37621 is missing, probably because its completion date is empty → observation O7 |
| On screen: Totals = the sum of the rows the page received | PASS (screen parity, Heavy Duty and Lethbridge) |

## 6 · Sales Tax Collected (Invoices tab and All tax rates tab)

**Sources:**
- SV-4573 "BE/FE Sales Tax report view" (Done, updated 2026-03-12)
- SV-4233 (Open feature request; Fabian: filter by PAID date)
- SV-4918, SV-5449 (rename), SV-9300, SV-10457
- CS training page **215941122** (15 Jan 2026)
- draft PRD **50200592 v12** (older, conflicts with the above → SQ-8).

**Pass 1** (`results-tax.json`, oracle = invoice records + customer-payment list):

| Check | Result |
|---|---|
| Labor, Parts (invoiced parts only, SV-9300), Shop Supply, Subtotal, row tax, Invoice Total = the invoice | 44,644 / 4 each (Parts 44,646 / 2). The fails are S2-7938 and S3-8059: two invoices share each of those numbers, a duplicate-number artefact in my matching (O6) |
| Created Date | 44,644 / 4 (S2-7938, the same duplicate) |
| Taxes: each rate and amount as saved on the invoice | 44,596 / 52, one-cent differences per rate → observation O3 |
| Listed invoice is not void | 44,648 / 0 |
| **Footer Total** = sum of Invoice Total (every status filter) | 64 / 0 ×3 |
| **All tax rates tab**: each rate total = sum of that rate (every status filter) | 64 / 0 ×3 |
| Hidden `totalTax` field = sum of row tax | 44 / 20 ×3. The server takes credit-memo tax off a total that no screen shows → observation O2 / SQ-9 |
| Preset by name = same dates as custom (location time zone) | 32 / 0 |
| Invoice Status / Paid Date / invoices listed | 3,960 / 8,256 / 52 FAIL. The customer-payment list I used here **misses deposits and $0 invoices**, so these rows are replaced by pass 2 |
| Listed invoice found in the location's invoice list | 0 / 2. S2-4080 was created on 31 Dec 2024, before my invoice list starts. It was paid on 3 Jan 2025, so it is listed correctly → harness scope |

**Pass 2** (`results-tax-status.json`, fresh oracle = each work order's own payments and deposits, `tools/check_tax2.py`):

| Check | Result |
|---|---|
| Invoice Status = the invoice's own payment status | 42,748 / 1,900 rows. The unique invoices behind them: **9 invoices part-paid by a deposit, still owing, shown "Paid"** (P2-2441, P2-2442, P2-2445, P2-2416, P2-2417, P2-2315, S2-37799, S2-32138, S3-16408); **428 $0.00 invoices** that read `unpaid` but are shown "Paid"; 5 old fully-paid invoices shown "Partially Paid" (S2-12942, S2-8142, S2-8869, S2-8789, S3-9151, O8) |
| Invoice Paid Date = date of the latest payment | 40,550 / 3,764 + 334 DEPOSIT. The 643 $0.00 invoices have no payment at all but carry a paid date (SQ-11a). On 20 deposit invoices the date is the invoice date, not the deposit date (SQ-11b). 1 is the S2-7938 duplicate |
| **Fresh reproduction on screen** | S1-38212 (deposit added through the API) and **S1-38214, made through the screen** (Add Deposit $30 → Record Deposit → Create Invoice). Both invoices read `partially_paid` with a balance of $105.00. The report shows **Paid**, and the Partially Paid filter says "No record matches these filters" (21:36 and 21:47 UTC). Sales By Representative shows the same invoice as `partially_paid` → **ADMISSIBLE**, `defects/DEFECT-CANDIDATE-sales-tax-status-deposit-paid.md` + `TICKET-W2-6-sales-tax-status-deposit-paid.wiki`, pictures `TAX-1-step-add-deposit.png`, `TAX-1a/1b/1c-*.png` |
| Ordinary part-payments (S1-38210: $50 then $85) | Partially Paid after the first payment, then Paid → **PASS** |
| Unpaid ("Invoiced") invoices never listed | Matches CS 215941122 and SV-4233; conflicts with draft PRD v12 → **SQ-8** |
| Credit memo tax | Not shown on this report; no source says whether it should be → **SQ-9** |

## 7 · Follow Up (hidden)

**No written source found.** Searches run: Confluence CQL `title ~ "Follow Up"`, `title ~ "Follow-up"`, `text ~ "Sales Follow Up"`; Jira `summary ~ "Follow Up" AND text ~ report`, `summary ~ "Sales Follow Up"`; Sentry `SalesFollowUp` (staging, 24 h). The page `/reports/sales-follow-up` is blank, and its data request returns **HTTP 500 on 12 of 12 reads** (4 locations × last 3 / 6 / 12 months) → **HELD, SQ-5**, `DEFECT-CANDIDATE-follow-up-report-server-error.md` + `TICKET-W2-5-…wiki`, picture `FOLLOWUP-1-blank-page.png`.

## Void exclusion (every report)
Seeded VOID invoice **S1-38207** (DVI Test) is left out of SBC, SBR, Sales, Advisor Analysis, Technician Efficiency (Invoiced) and Sales Tax: **12 / 0**. The Completed tab still counts its line: **2 / 0**, because SV-5450 says completion, not the invoice, decides.

## Observations (not defects; listed for the record)
- **O1** The SBR per-rep invoice request ignores the page number and returns every invoice. S6-R2 asks for a lazy, paged drill-down. This was only seen through the requests, and the screen works.
- **O2** On Sales Tax, the hidden `totalTax` is reduced by credit-memo tax, but no screen shows it (SQ-9).
- **O3** On 52 Sales Tax rows, one rate's amount differs from the saved invoice by $0.01.
- **O4** Void invoice S1-38207 still appears as $135.00 owing in the customer's New Customer Payment window, and its work order stays "Invoiced". This is outside the reports scope and is passed on for the payments owner.
- **O5** In invoice S2-5329's own record, the lines and fees do not add up to its subtotal; they are $10.00 out.
- **O6** Two invoice numbers are used twice: S2-7938 and S3-8059.
- **O7** A Complete line on S2-37621 with clock records appears in no Completed window.
- **O8** 5 old fully-paid invoices show "Partially Paid" on Sales Tax. A fresh two-payment test was correct.

## Already verified by the dashboard pass (cited, not redone)
Dashboard worked hours match the reports, 5,422 / 5,425 (`../../RUN-STATE.md`). **F2** covers declined lines in Technician Efficiency. **F1 = SV-11688.**

## Records I created (DVI Test, customer "ZZAUTOTEST Dash A1", unit ZZ-A1)
| Work order | What | State left in |
|---|---|---|
| S1-38205 (4aa5a09e…) | first void attempt, abandoned | Complete, no invoice |
| S1-38207 (8103ad2d…) | VOID invoice 46e45b71… (void after a second line was added) | void invoice; work order shows "Invoiced" |
| S1-38210 (75c64fba…) | rep snapshot test (Viktoria Videnovic → Ahtasham Admin); payments $50 + $85 | Paid |
| S1-38211 (315a66c9…) | payment test; the first screen run left a $50.00 overpayment credit **DEP1-4814** | Paid, credit $50 open |
| S1-38212 (fa4f0062…) | $30 deposit DEP-4815 (API), then invoiced | Partially paid, $105 owing |
| S1-38214 (5a2c135e…) | $30 deposit DEP-4816 **through the screen**, invoice **through the screen** | Partially paid, $105 owing |
| clock records | Esther Howard, 30 min each on the S1-38205 and S1-38207 lines | — |

The IDs are in `/tmp/cln/w2/seed_*.json`. These records are throwaway and named ZZAUTOTEST. They were left in place as evidence for the tickets.

## Harness lessons (so the next run does not repeat them)
1. The browser needs localStorage **`timezone`** as well as `location`. Without it, pages send UTC windows. That was my error, not a finding.
2. The SBR `/{rep}/invoices` request ignores paging. A paging loop must stop when the first item repeats, or it never ends (it used 11 GB before I stopped it).
3. Invoice numbers are not unique (S2-7938, S3-8059). Match rows by invoice or work order ID, never by number.
4. `/api/customer-payment/list` does not include deposits. Take payments from the work order's `customer_payments`.
5. The asset label follows the work order's **current** vehicle (SV-9459), not the invoice's snapshot.
6. Line-level fees and discounts fold into Labor and Parts (Stats `adjustments`, scope `labor_line` / `part_line`).
7. When a report differs from **today's** Stats tab, check the invoice record before calling it a fault. Lines and credits added after invoicing change the Stats tab but not the invoice.
