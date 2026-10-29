> **Correction, 29 Oct 2026:** RQ-7 and RQ-8 (sent to Chris as questions 38 and 39) contained mistakes. RQ-7: the customers' cards now say Net 30/50/60, not COD. RQ-8: the Admin Shopview figures (40.70 h, 32.34 h) were read with the time zones unmatched; with them matched they are 7.70 h and 12.10 h. Haley Brown's 28.50 h on 6 Sep is correct. Rewritten questions: `../../chris-answers-2026-10-29/REWRITTEN-Q38-Q39.md`.

# W4 — Finance, Accounting and Communications reports · FULL pass · 28 Oct 2026

**Build:** `v26.43.2-f8698cb` (read from `<meta name="app-version">` at 19:41 UTC and again at 20:43 UTC — unchanged). Staging, quick-login Admin.
**Code read for check design only (never as expectation):** develop `e8b3c4b31` at `/home/user/sv-develop`.
**Session time zone rule applied:** every report read with the session switched to the location first (`change-location`), as-of = the location's 23:59:59.999.
**Nothing written to TestRail. No Jira ticket created or commented. No git add/commit.**
**Data created and restored:** one IBS batch (`87e03bd1-91aa-48b0-b9c0-c6d36bc1edc4`, Heavy Duty) made from S2-16140 + S2-16146 to test "Remove from batch", then emptied — both invoices are back in Ready to Send and the batch no longer exists (log `/tmp/cln/w4/ibs_experiment.json`). Nothing else was created.

## Written sources (read live 2026-10-28 with the Atlassian MCP; version = Confluence version number)

| Report(s) | Source | Version · date |
|---|---|---|
| A/R Aging Summary / Detail / Collection | Confluence 82083852 "AR aging summary report, detail report and collections report" (Jira SV-2316, SV-5025, SV-5028) | **v25 · 2026-02-19** |
| (support companion) | Confluence 288456706 "A/R Aging Summary, Detail, and Collections Reports" | v1 · 2026-02-03 |
| A/P Aging Summary / Detail / Unpaid Invoices | Confluence 265093124 "AP reports" (SV-5653, SV-5654, SV-5655, SV-6163) | **v13 · 2026-03-18** |
| Future change to all six (NOT built — epic SV-11315 "Ready for Development", all 9 stories Open) | Confluence 947650561 "A/R and A/P Report Sorting, Export and Location Filter" | v9 · 2026-10-23 — used only to recognise already-known/scheduled items |
| IBS Batches | No PRD. Jira SV-2144 (Batch Transactions workflow), SV-2441 / SV-2427 (only IBS customers), SV-11065 (export CSV headers), SV-9623 (remove from batch) | Jira, read live |
| QB Unexported | **No written spec found.** Fixed tickets used as behaviour statements: SV-9866, SV-10630, SV-11250 | — |
| Export Reports | **No written spec of the file layouts found.** SV-11065 (IBS export only), SV-8591 (export contract), SV-8713 | — |
| Notes Report / Reminders Report | **No written source found.** | — |

Searches run for the "no source" reports: Confluence CQL `type = page AND (title ~ "IBS" OR title ~ "unexported" OR title ~ "notes report" OR title ~ "reminders" OR title ~ "export reports" OR text ~ "\"QB Unexported\"" OR text ~ "\"Notes Report\"" OR text ~ "\"Reminders Report\"" OR text ~ "\"IBS Batches\"" OR text ~ "\"Export Reports\"")` (56 hits, none a spec for these screens); Jira `summary ~ "notes report" OR "reminders report" OR "unexported" OR "IBS batch" OR "batch transactions" OR "export reports" OR "QB Unexported"` (60 hits, bugs only), `summary ~ "IBS"` (36 hits), `"communication(s)" / "Notes report" / "Reminders report"` (20 hits).

## Summary of checks

| Report | Checks run | PASS | FAIL | Of the FAILs |
|---|---|---|---|---|
| A/R Aging Summary / Detail / Collection (5 snapshots; plus the 1,355-invoice ledger compare, 4 historical replays, 3 PDFs) | 208 | 202 | 6 | C4/C5 ×2 → RQ-1 (same-day credit, HELD); L2 → SV-11691 (known); L3 → RQ-2 (part-sale deposit, HELD) |
| A/P Aging Summary / Detail / Unpaid Invoices (5 snapshots; plus the 14,315-row vendor-page compare) | 218 | 201 | 17 | PD6a/PU4 ×5 → **TICKET-AP1 (ADMISSIBLE)**; PD6b → RQ-1 (same-day vendor credits) and Edmonton DST artefacts of our own date conversion; PD9 → data observation; PL1/PL2 → superseded by the per-location compare (all match) |
| IBS Batches (4 locations, 4 batches, 1 payment, 4 export files) | 44 | 40 | 4 | I6 → RQ-3 (HELD); I2 → RQ-5; I1 → count field not shown on screen (N/A); I10 → the extra export row is the batch's credit (re-read: PASS) |
| QB Unexported (4 locations × 3 tabs) | 60 | 56 | 4 | Q3/Q4 → RQ-6 |
| Export Reports (11 exports, Sep 2026, Heavy Duty) | 18 | 13 | 5 | X-INV3/4 → RQ-9 (time zone); X-INV5 → RQ-7; X-PR2 → RQ-8; X-PAY1 → 16 rows NOT VERIFIED (no record fetched) |
| Notes Report / Reminders Report (4 locations, all presets) | 276 | 244 | 32 | N2/N5/N7 → RQ-4 (100-note limit, HELD) |
| **Total (raw rows in the results files)** | **824** | **756** | **68** | 1 admissible ticket · 4 held candidates · 2 known tickets confirmed · 9 PO questions |

Raw rows: `results-ar-*.json`, `results-ap-*.json`, `results-ap-ledger-by-location.json`, `results-ar-history.json`, `results-ar-pdf-hd_2026-09-30.json`, `results-ibs.json`, `results-qb-unexported.json`, `results-exports-hd_last_month.json`, `results-notes-reminders.json`. Tools in `tools/`.

---

## 1 · A/R Aging Summary, A/R Aging Detail, A/R Aging Collection

**Snapshots** (org-wide reports; session at Staging Heavy Duty - 9919 / Asia/Karachi unless stated): as of 29 Oct 2026 (today there) — 215 customers, 1,465 Detail rows, 209 Collection customers, Total **$699,068.20**; 30 Sep 2026 — 63 / 1,119 / 53, $637,979.36; 30 Jun 2026 — 43 / 177 / 15, $350,060.96; 31 Dec 2025 — 26 / 41 / 8, $81,570.66; Lethbridge (Edmonton) as of 28 Oct 2026 — 215 / 1,465 / 209, $699,068.20. Every page read in full (rowsPerPage 1,000, one page each).

**PASS on every snapshot (observed):**
- Summary: Totals row = sum of rows for Current, 1–30, 31–60, 61–90, 91+, Total (S1, 6 columns); each row's Total = its five buckets (S2); no customer twice (S3).
- Detail: per-section Amount and Open Balance totals = rows (D1/D2, 5 sections); grand Amount / Open Balance = sections (D3/D4); every row in the section its days give — invoices by *selected date − due date*, credits by *selected date − creation date* (D5); no credit in Current (D6); credit Due Date = creation date (D7); every row names its location — rows from Heavy Duty, Lethbridge, DVI Test, QB Location and other org locations appear, i.e. "all locations within organization" (D8); invoice open balance between 0 and amount (D9); no duplicates (D10).
- Summary vs Detail: every customer, every bucket identical (X1); same customers (X2); Summary Totals = Detail section totals (X3).
- Collection: customer totals = rows (C1); grand totals = customer totals (C2/C3); no customer twice (C6); holds exactly the past-due Detail rows (X4).
- Due dates: 1,355 of 1,355 open invoices — due date = invoice date + the invoice's credit term (Net N / COD).
- Print (SV-5028): Summary / Detail / Collection PDFs for 30 Sep 2026 carry the report name, "Foothills Group Inc", "As of Sep 30, 2026" and every on-screen total (6/6, 7/7, 2/2).

**Independent recompute (different code path — each customer's own account):** 215 customers' open items read from the customer's Invoices-tab data (`customer-account/list-unpaid-transaction`) plus deposits list. **1,349 of 1,355 open invoices agree to the cent**; all 67 credit memos and 9 deposits agree (other-location credits re-read at their own locations, 30/30). The 6 differences:
- 4 invoices S2-8650, S2-8771, S2-8092, S3-8848 ($9,264.44) open in A/R but settled on the customer account → **SV-11691 (known, In Progress) — confirmed, not re-filed.**
- 2 part sales P2-2352 ($543.43 vs $443.43) and P2-2439 ($21 vs $16) → held deposit on an invoiced part sale → **HELD, RQ-2** (`defects/DEFECT-CANDIDATE-ar-aging-part-sale-held-deposit.md`; screen-observed, pictures DEP1-1/-2).

**Historical as-of (PRD: "If an invoice was unpaid on the selected date but paid later, it must still appear"):** each invoice replayed from its record total minus the customer's own payments (with settlement amounts) dated on/before the as-of instant. 31 Dec 2025: **38/38** identical. 30 Jun 2026: **173/173**. 30 Sep 2026: 1,030 of 1,034 identical; never does the report show an invoice the replay calls settled. Residual NOT VERIFIED: 4 invoices where A/R is lower than the replay and 13 the replay still calls open (3 proven paid by an IBS batch payment on 17 Sep 2026 that the customer Payments list does not carry; the rest settled by deposits / portal payments the replay cannot see).

**Findings:**
- **Credits created on the as-of date are listed on A/R Collection with Past Due 1** (CM2-4462, CM2-4463 on 30 Sep; CM1-4535 on 28 Oct) — the PRD says ≤ 0 days are not shown, but SV-5606 (Done) asked for exactly this → **HELD, RQ-1** (`defects/DEFECT-CANDIDATE-ar-collection-same-day-credit.md`, picture AR1-1).
- **SV-11690** (Ready for Production): confirmed the fix is on staging — work-order deposits never applied (e.g. 4 Star Truck Repair DEP2-4716 / DEP2-4717) are no longer in A/R; 7 deposit rows remain (free-floating or partly used, −$17,333.35), which is the rule the fix states. The part-sale gap above is the only remaining mismatch found.
- Already documented and scheduled (SV-11315 PRD, Stories 1/2/5/6 Open — **not filed**): rows come out in no set order; the Collection Totals row ignores the Customer filter (observed: E2E Credits Customer selected, Totals still $387,313.67 / $346,364.63 — the whole report); labels "Date" (not "As of") and "Location Full Name". The PRD's note that the Summary Totals row counts overpaid invoices the rows don't was **not** seen on staging (S1 passes on all five snapshots).

**NOT VERIFIED:** "real-time" refresh after a payment (no payment made — the A/P equivalent was seen: bill ZZPV10282011 created 20:13 UTC appeared on the next read); Excel download (not built — SV-5028 delivered Print only; SV-11533 Open); the Print button's own date choice (PDFs were requested with our as-of value); customers at the org's other locations (E2E Dashboard shops) were compared only through the report itself.

## 2 · A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices

**Snapshots:** as of 29 Oct 2026 — 474 vendors, 14,527 Detail rows, Total **$4,828,986.54**; 30 Sep 2026 — 452 / 14,093 / $4,784,153.19; 30 Jun 2026 — 406 / 11,994 / $4,137,556.18; 31 Dec 2025 — 331 / 7,786 / $2,697,971.07; Lethbridge 28 Oct 2026 — 474 / 14,527. All pages read.

**PASS on every snapshot:** Summary Totals = rows (6 columns), row Total = buckets, no vendor twice, every vendor has at least one open document (a $0 row = an invoice and a credit that net to zero — PRD keeps them); Detail section and grand totals (Amount, Open Balance); every row in its section; no vendor credit in Current; credit Due Date = creation date; location on every row; no duplicates; Summary = Detail per vendor per bucket; Unpaid Invoices per-vendor and grand totals = rows; credit rows leave Due Date and Past Due empty (PRD "for credits we don't have this column populated"); Unpaid holds exactly the Detail documents; same vendors on Summary and Unpaid.

**Independent recompute:** every vendor's own Unpaid Invoices page (`list-unpaid-by-vendor-account`) read at each location with the session switched there: Heavy Duty **9,420/9,420** documents and balances identical, Lethbridge **4,880/4,880**, QB Location 11/11, DVI Test 4/4 (+1 bill created at 20:13 UTC after the snapshot — present on the re-read). 212 rows at the org's other locations (E2E Dashboard shops, ZZAUTOTEST F2 Empty Shop) not compared.

**Findings:**
- **Past Due is one day short for every bill not yet due** (A/P Aging Detail and A/P Unpaid Invoices): bill due tomorrow shows 0, due in 10 days shows −9. 481/481 on 29 Oct 2026, 985/985, 1,098/1,098, 906/906 on the older dates, 449/491 at Lethbridge. Screen-proven at two locations / time zones → **ADMISSIBLE — `defects/TICKET-AP1-ap-past-due-one-day-short.wiki`** (pictures AP1-1, AP1-2).
- A vendor credit created on the as-of date shows Past Due 1 (C-10617, C-10450 on 30 Jun 2026; C-5297, C-5294, C-5320 on 31 Dec 2025) → same question as RQ-1.
- Observation (not a report defect): bills 055-541861 (Amount $643.36, Open $643.38) and 069-855902 ($4.29 / $4.31) have an open balance 2 cents above their amount — identical on the vendor page, so the report shows the record faithfully.
- Already documented and scheduled (SV-11315 Story 5): the A/P Unpaid Invoices Totals row ignores the Vendor filter (observed: 123 Cannabis Forestlawn selected, Totals $4,821,919.26). Not filed.

**NOT VERIFIED:** A/P Print — SV-6163 is In Progress (no Print/Export on A/P screens; not built); the Summary vendor-name link (no time left this run); Lethbridge "PD6b" rows (784) are our own date-conversion artefact for bills stored at local midnight across the DST change — not counted as findings.

## 3 · IBS Batches, QB Unexported, Export Reports

**IBS Batches** (4 locations; Heavy Duty 6 invoices + 2 credits Ready to Send, 2 batches, 1 payment; Lethbridge 2 batches): Ready to Send lists only open invoices of customers with an IBS number on their customer card (6/6), only that location's invoices, Total = the invoice's own total (6/6), never both Ready and Sent (PASS). Batches: 3 of 4 add up exactly and their status follows the balance. Payment amount = its invoices (PASS). Export files (SV-11065): header line *Acct#, Ref#, Amount, PO, Invoice Date* in that order (4/4 PASS, after a 5-line preamble Dealer# / Invoices / S/C / Credits / Net Total); one row per batch invoice / credit with its amount (4/4 PASS).
- **Lethbridge batch of 2 Oct 2026: Total $9,473.35 vs its 9 invoices $9,183.29** (export also says $9,183.29); screen-observed; cause not re-created ("Remove from batch" updates totals correctly — tested) → **HELD, RQ-3** (`defects/DEFECT-CANDIDATE-ibs-sent-batch-total.md`, picture IBS1-1).
- A $0.00 invoice (S2-16924) waits in Ready to Send → RQ-5.

**QB Unexported** (4 locations × Customers / Vendors / Journal Entries): tab-label count = rows listed in all 12 (Heavy Duty 2,419 / 819 / 84; Lethbridge 444 / 248 / 1; QB Location 0 / 1 / 0; DVI Test 0 / 0 / 0) — PASS; every row in its own tab — PASS; every row carries an error reason — PASS; customer name present (SV-9866) except 5 refund/credit rows. Blank "No." on every credit-memo, payment and application row (Heavy Duty 548, Lethbridge 33, Vendors 26 payments) and 111 documents listed twice with two different errors → RQ-6. Ghost rows of reversed invoices are SV-11721 (Ready to Fix, known).

**Export Reports** (all 11 exports, *Last Month* = Sep 2026, Heavy Duty; the files are organisation-wide):
- Customer Invoice (942 invoices, 2,348 lines): lines + tax = the invoice record total **942/942**; quantity × rate = amount **2,348/2,348**; Customer correct 942/942; every cached invoice dated in September is in the file (942/942). Dates: Lethbridge invoices match their location calendar; Heavy Duty invoices made late in the UTC day print one day early in Karachi terms → RQ-9 (staging time-zone set-up). Terms wrong on 7 invoices (Net 30/50/60 on COD invoices) → RQ-7.
- Customer Payment (181 rows): 109/109 invoice payment rows match the customer's Payments list; 20 deposit rows, 36 refund/credit rows and 16 rows for invoices of customers we did not fetch → NOT VERIFIED.
- Journal Entry: 270/270 entries balance to zero; all dates in the window.
- Vendor Bill: 549 bills still open compared with A/P Detail — lines + tax = bill amount 549/549; dates in window.
- Vendor Bill Payment: dates in window; negative amounts only on applied vendor-credit lines (C-…).
- Payroll Timesheet: Total = WO + Internal on every day; 5 employee-days over 24 hours (max 40.70 h) → RQ-8.
- Not compared beyond a successful download: Customer Contact (497 rows), Vendor Contact (37), Vendor Credit Memo (4), Sales Representative Assignments (1,862), Customer Credit Memo amounts.

## 4 · Notes Report and Reminders Report (no written source — internal consistency only)

All four locations (the lists are organisation-wide: 2,545 notes, 20 with a reminder). Presets All, Today, This Week, Last Week, This Month, Last Month, Custom (1–30 Sep), both sort orders, Filter by Author, Filter by Mention; Reminders: All, Today, This Week, Next Week, Last Week, This Month, Next Month, Last Month, mentioning the signed-in user (as the screen sends it).
- PASS: every listed note is inside its range (N1, 56/56); sort order correct (N3, 56/56); author and mention filters list only matching notes (N4, N6); Reminders list exactly the reminders whose date falls in the chosen days and that mention the user (R1/R2/R3, 96/96).
- **FAIL: the Notes Report never shows more than 100 notes** — screen: *All* ends at 100 cards (server says more exist); *Last Week* 100 of 255; *This Month* 100 of 326; Author 100 of 1,105; Mention 100 of 110; *Oldest First / All* 82. → **HELD, RQ-4** (`defects/DEFECT-CANDIDATE-notes-report-stops-at-100.md`, picture NOTES1-1).
- Known, not re-checked: SV-7933 (Author filter list incomplete, Open).

## Defect drafts (in `defects/`)

| Draft | Verdict |
|---|---|
| `TICKET-AP1-ap-past-due-one-day-short.wiki` + candidate | **ADMISSIBLE** — ready to file on the QA lead's go-ahead |
| `TICKET-AR1-ar-collection-same-day-credit.wiki` + candidate | HELD — RQ-1 (PRD vs SV-5606) |
| `DEFECT-CANDIDATE-ar-aging-part-sale-held-deposit.md` (draft SV-11690 comment inside) | HELD — RQ-2, SV-11690 family |
| `TICKET-IBS1-sent-batch-total-not-sum-of-invoices.wiki` + candidate | HELD — RQ-3 (no written rule; cause unknown) |
| `TICKET-NOTES1-notes-report-stops-at-100.wiki` + candidate | HELD — RQ-4 (no written source) |
| SV-11691 (4 invoices Paid with $0 payments) | already reported — confirmed 28 Oct 2026, not re-filed |
| SV-11690 (held deposits in A/R) | already reported — fix confirmed on staging |
| SV-11315 items (order, Totals ignore filter, labels) | scheduled — not filed |
