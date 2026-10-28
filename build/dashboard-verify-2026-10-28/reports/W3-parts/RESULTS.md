# W3 — Parts reports, FULL pass · Parts Velocity + Inventory Value · 28 Oct 2026

Staging, build **`v26.43.2-f8698cb`** (read at start 19:4x UTC and again at end 20:40 UTC — unchanged). Admin (quick-login), own private session (`tools/mint_w3.mjs`, `/tmp/cln/w3/`, so no time-zone race with the other workers' shared session). Four locations: Staging Heavy Duty - 9919 (Karachi), Staging Lethbridge - 4310 (Edmonton), QB Location (Vancouver), DVI Test (Toronto). Expected behaviour is taken from the written sources only; the code was read only to design checks. No TestRail writes, no Jira writes.

## Sources used (read live today)
| Report | Source | Version / date | Saved copy |
|---|---|---|---|
| Parts Velocity | Confluence **620888066** "Parts Velocity Report" | **version 12**, last modified 14 Sep 2026 (Chris Ward) — our last record was v4 (29 Jul) | `sources/PV-spec-620888066-read-2026-10-28.md` |
| Parts Velocity | **SV-11514** "Parts Velocity: Last 90 Days default and remembered range" (Done) | updated 26 Oct 2026 | — |
| Parts Velocity | **SV-9219** Type filter standard (Done) · **SV-9809** (Done) · PO answer 5 Aug 2026 item 5.0 (date list) | — | `../../../report-suite/chris-answers-2026-08-05/ANSWERS-INGESTED.md` |
| Inventory Value | Confluence **720142338** "Inventory Value Report" | **version 10**, last change-log entry 13 Aug 2026 — our last record was v3 | (body read via `fetch`, version from its metadata) |
| Both | Jira search, 100 newest Parts Velocity / Inventory Value tickets | 28 Oct 2026 | `sources/jira-pv-iv-search-2026-10-28.json` |

## Headline
| | Checks | PASS | FAIL | Notes |
|---|---|---|---|---|
| PV — internal rules, every row × 12 date windows × 4 locations × 3 Type values (`results-pv-internal.json`) | 1,992,193 | 1,992,025 | **168** | all 168 = Special Order rows with Last Sale "—" = **D1** |
| PV — independent recompute from invoices + work-order lines, stocked parts, 9 windows × 4 locations (`results-pv-recompute.json`) | 40,636 money/units checks | 40,636 | 0 | Revenue, Margin (= cost on the work-order part), Sold (WO), Sold (Parts Sale) all exact for 10,159 part-rows |
| PV — row presence vs raw records (stocked parts) | 20 | — | 20 explained | 9 = deleted parts losing past sales (**PQ-6**); 6 = $0 rows correctly left out by S3-N1; 5 = one invoice created after the raw cache (today) |
| PV — filters, every value present in the data (Category 94, Vendor 317, Bin 200, Search 14, two locations) (`results-filters.json`) | 1,870 | 1,865 | 5 | 4 = my check could not slice vendors/categories seen only inside multi-vendor rows (inconclusive, not a defect); 1 = two-location read used a different time-zone window (4 rows, inconclusive) |
| PV — sort, all 20 columns × both directions, full result (`results-sort.json`) | 40 | 36 | 4 | 4 = text columns: punctuation ordering of the database collation (e.g. `10'X2"` after `10-27200-02`) — not a defect |
| PV — date presets on screen (`results-pv-date-presets.json`) | 11 | 11 | 0 | every preset's window right in the location's time zone; week starts Sunday |
| PV — seeded known data (DVI Test), 7 events, every column read after each | 3 parts | 2 parts right on every column except Demand | Demand on 4 readings + the SO1 row | see §PV-4 → D1 and D2 |
| IV — internal rules, every row of 10 days × 4 locations + all locations (`results-iv.json`) | 798,726 | 798,725 | 1 | the 1 = my matrix assumption, resolved as PASS (§IV-3, PQ-8) |
| IV — filters, every category (118), every vendor in stock, search, two locations | 1,485 (in `results-filters.json`) | 1,485 | 0 | totals recomputed over the filtered set every time |
| IV — sort, 11 columns × both directions | 22 | 16 | 6 | 4 = text collation as above; 2 = Margin % ties at 55.0% ordered on the unrounded value — invisible on screen (both read 55.0%) |

**Findings:** 2 ADMISSIBLE drafts (D1, D2) · 8 PO questions · 2 already reported and still live (SV-10380, SV-10080) · 3 previously-raised-and-closed items that still reproduce (SV-8926, SV-8927, SV-8930 — QA lead to decide) · observations below.

---

## PARTS VELOCITY

### PV-1 Columns (S4-R2/R3/R4, S5-R4, S5-R4a, S5-R5) — PASS except D1/D2
Screen default columns observed: Type, Part #, Description, Category, Vendor, Units Sold, Avg Cost, Avg Sell, Revenue, Margin, Margin %, Demand, Last Sale, On Hand — exactly the 14 of S4-R2, in order. Tooltips on Units Sold and Demand verbatim as S3-R6.
Per row, every window, every location (1.99 M checks):
- **Avg Sell** = Revenue ÷ billed units, **Avg Cost** = (Revenue − Margin) ÷ billed units, "—" when billed units ≤ 0 — PASS 37,726 + 217,388.
- **Margin %** = Margin ÷ Revenue, "—" when Revenue ≤ 0 — PASS 36,408 + 218,706.
- **Turns/Yr** = (Units Sold ÷ window days × 365) ÷ On Hand, 0 when On Hand is 0 — PASS 231,840 + 4,234 (window = inclusive days, e.g. This Year 301 days on 28 Oct).
- **Special Order**: Units Sold = Sold (WO) + Sold (Parts Sale) (S5-R7) PASS 19,040; On Hand / Min / Max / Turns blank PASS 19,040; **Last Sale present FAIL 168 → D1**.
- **S3-N1** no stocked row with no movement, < 1 on hand and $0 revenue — PASS 236,074. Counts never blank — PASS. Demand ≥ 1 whenever net Units Sold > 0 — PASS 20,034. Last Sale within the window whenever Demand > 0 — PASS 39,236.
- **Independent recompute** (invoice records + work-order lines, a different path from the report): Revenue, Margin, Sold (WO), Sold (Parts Sale) for every stocked part billed in 9 windows at 4 locations — **10,159 / 10,159 exact** each.
- Stocked-part **Units Sold / Demand** (stock movement) agree with billed quantities on 8,598 / 10,159 and 8,410 / 10,159 rows. The spec allows these to differ (S5-R7), the part history only starts in Aug 2026, so the older differences are **NOT VERIFIED** individually; the seeded checks below verify the movement columns exactly.
- **Special Order money by part number** agrees on 7,497 / 8,028 rows; the rest are part-number variants of one catalogue part (proved for A5411870080: DDE-A5411870080 + A5411870080 = one row) or vendor parts with no catalogue link (out of scope by S5-R2). Not a defect; exact special-order money was verified on seeded data (SO2).

### PV-2 Filters (S2) — PASS
Type: menu "Select all / Inventory / Special Order / Clear selection" (SV-9219 standard); Both = Inventory ∪ Special Order with identical values, 48 / 48. Category 94 values, Vendor 317 values: stocked rows exactly the parts in that category/vendor, every row shows the filtered value (S3-R10a). Bin 200 values: no Special Order rows, stocked rows exactly the parts held in that bin. Search 7 terms incl. upper/lower case: part # or description, case-insensitive. Two locations: one stocked row per part per location; a special-order part at both shows **Multiple**. Location default = active location (DVI Test).

### PV-3 Date options (S2-R2, SV-11514, PO answer 5 Aug)
Observed list: This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 90 days, Last 12 months, Custom; default **Last 90 days**. Every window checked on screen in the location time zone — PASS (e.g. Last week 18–24 Oct, Last 12 months 1 Nov 2025 – 28 Oct 2026). Open: Last 90 days covers 91 days (**PQ-1**); spec text still lists Today/Yesterday (**PQ-5**). Custom > 366 days and the 366-day cap: NOT re-verified this pass (verified 19 Aug, HTTP 400 "Date range cannot exceed 366 days.").

### PV-4 Seeded known data (DVI Test, ZZAUTOTEST) — exact values
Stocked part ZZAUTOTEST-PV1-10282011 (10 in stock, cost $20.00, sell $30.00):
| Event | Units Sold | Demand | Revenue | Avg Cost / Sell | Margin % | On Hand | Turns/Yr (Today) | Verdict |
|---|---|---|---|---|---|---|---|---|
| S1-38203 invoiced (2) | 2.00 | 1 | $60.00 | $20.00 / $30.00 | 33.3% | 8.00 | 91.25 | PASS all |
| invoice reversed | 0.00 | 1 | $0.00 | — / — | — | 8.00 | 0.00 | PASS (S3-E1, S5-R4a) |
| invoiced again | 2.00 | **2** | $60.00 | | | 8.00 | | **FAIL Demand → D2** |
| S1-38204 invoiced (3) | 5.00 | **3** | $150.00 | | 33.3% | 5.00 | 365.00 | **FAIL Demand → D2** |
| vendor return of 1 (Parts → Returns) | 5.00 | 3 | | | | 4.00 | 456.25 | Units Returned 1.00 (**PQ-3**); cancelled → 0.00 ✓ |
| S1-38206 (screen) invoiced (1) | 6.00 | 4 | $180.00 | $20.00 / $30.00 | 33.3% | 3.00 | | Demand should be 3 |
| S1-38206 reversed + invoiced on screen | 6.00 | **5** | $180.00 | | | 3.00 | | **FAIL → D2** |
Special order ZZAUTOTEST-SO2 (ordered, received, invoiced $80.00, cost $50.00): 1.00 / $50.00 / $80.00 / $80.00 / $30.00 / 37.5% / Demand 1 / Last Sale 0 days — **PASS all**; after the reversal the row leaves the report (S5-R4b) — PASS.
Special order ZZAUTOTEST-SO1 (ordered, **Receive later**, billed $60.00 on S1-38203 and $68.96 on INV-S1-38206): 0.00 / — / — / $0.00 / $0.00 / — / 0 / — — **FAIL → D1**.
On Hand / Min / Max / Category / Vendor "—" all as entered — PASS. This Year Turns 0.30316 = 2 × 365 ÷ 301 ÷ 8 — PASS.

### PV-5 Not verified this pass (and why)
Exports (CSV/PDF) — out of this pass's calculation scope; last verified 19 Aug (SV-8818 PDF failure still open then). Parts-sale credit and work-order part returns into Units Returned — no seedable vendor return on an invoiced order today (an inventory part cannot be returned from a work order: "Cannot return inventory part"). Saved view / remembered range (SV-11514 second half). Core-part exclusion — no core part exists in the org (hold carried from 19 Aug). Empty-state wording. Fractional quantities.

---

## INVENTORY VALUE

### IV-1 Columns and totals (S3, S4) — PASS
Every row, every collected day (today, d-1, d-2, d-7, d-30, d-60, d-90, d-365, d-400, tomorrow) × 4 locations + all four together: Total Cost = Qty × Unit Cost, Total Sell = Qty × Unit Sell, Margin = Total Sell − Total Cost, Margin % = Margin ÷ Total Sell ("—" when Total Sell ≤ 0) — 134,310 rows, 0 errors. Totals row = sum of rows for Qty, Margin, Total Sell, Total Cost and Margin % recomputed from the totals (S4-R3) — 31 / 31. Default sort Total Cost highest first — PASS. Seeded part on screen: 4.00 · $20.00 · $37.04 · $68.16 · 46.0% · $148.16 · $80.00; Totals 6.00 · $70.60 · 46.3% · $152.60 · $82.00 — PASS.

### IV-2 Independent recompute, today (parts list = a different code path)
Every stocked part at the 4 locations (11,306): a row appears exactly when the part is not a core and has stock > 0 — PASS 11,306. Qty, Unit Cost (part cost), Unit Sell (parts-list sell price, as S3-R5's key decision requires), Category, Vendor — 9,666 / 9,666 each.

### IV-3 Unit Sell recomputed from the pricing matrices + fixed prices — 9,665 / 9,666
The one difference: cost above the highest band of the category matrix uses that band's markup (= parts list). PASS by the key decision; **PQ-8**.

### IV-4 As-of day (S5)
Today is live (Karachi user just after midnight correctly reads 29 Oct); a past day replays that day's nightly record; tomorrow is capped to today; days before each location's first nightly record (tried: HD and Lethbridge 30–31 Jul, QB 29 Aug, DVI 21 Oct) return no rows and zero totals — PASS 45 / 45. All four locations together = sum of each location for the same day — PASS. On screen: "As of: 10/27/2026" with no second "As of" line when the day has a record (S5-R6) — PASS. The "resolved earlier day" line (S5-R5) could not be exercised — every day since recording began has a record (NOT VERIFIED). Snapshot equal to the live value for an unchanged day: HD 28 Oct record = live 29 Oct (same totals) — PASS.

### IV-5 Filters (S6, S7) — PASS
Every one of the 118 categories, every vendor with stock (244 reads), 7 search terms, two locations: exactly the matching parts, values unchanged, totals recomputed over the filtered set every time (1,485 checks, 0 errors).

### IV-6 Previously reported, closed OBSOLETE, still on screen (QA lead to decide — no new draft, A4 counts closed tickets)
- **SV-8927** — first visit shows Margin and Total Sell (spec S3-R12/S3-R13: hidden by default). Observed on a fresh browser today.
- **SV-8926** — totals row reads "Totals" (spec S4-R1: "Total").
- **SV-8930** — empty state reads "No record matches these filters / Try changing filters to widen your results." (spec §7: "Empty bays, endless possibilities. Get Going!"). Also the column header reads "Qty" where S3-R1 says "Qty on Hand" (cosmetic, not raised before).

### IV-7 Already reported, fix not on staging
- **SV-10380** (TESTING QA) — negative bins ignored. Live: 22 parts with mixed +/− bins overstate value by $1,730.14 at cost; 19 negative-only parts are left out (e.g. 13M35152-PTO bins 8 / −2 shows 8).
- **SV-10379** (Blocked) — attached core charges: NOT VERIFIED (no core part in the org).

---

## Defects
| # | Finding | Verdict | Files |
|---|---|---|---|
| D1 | Parts Velocity: special-order part billed while "Receive later" shows 0 sold, $0.00 revenue, Demand 0 | **ADMISSIBLE draft** (parent SV-8645) | `defects/DEFECT-CANDIDATE-pv-receive-later-special-order-not-counted.md`, `defects/TICKET-D1-…wiki`, `defects/pictures/D1-1…D1-3` |
| D2 | Parts Velocity: Demand counts a work order twice after Reverse + Create Invoice | **ADMISSIBLE draft** (parent SV-8645) | `defects/DEFECT-CANDIDATE-pv-demand-counts-reinvoice-twice.md`, `defects/TICKET-D2-…wiki`, `defects/pictures/D2-1…D2-2` |
| — | PV Vendor/Category never show "Multiple" on multi-vendor rows (SUBLET, FREIGHT) | already reported **SV-10080** (Code Review, not on staging) | — |
| — | IV negative bins | already reported **SV-10380** | — |
| PQ-1…8 | see `PO-QUESTIONS.md` | HELD for PO | — |

## Observations (not filed)
- O1 PV Units Sold / Demand on old data use the stock-movement date; for some parts the billed sale has no stock movement at all (PQ-7). Part history starts Aug 2026, so the old cases cannot be proved either way.
- O2 PV sort of text columns follows the database collation for punctuation; IV Margin % ties at the displayed precision are ordered on the unrounded value. Neither is visible as wrong on screen.
- O3 A special order added from the **Catalog** option (instead of the zero-stock **Inventory** option) gets no catalogue link, so it never appears in Parts Velocity at all (by S5-R2's own definition) — worth knowing when writing test steps.
- O4 The API accepts a future as-of day and caps it to today (the screen offers no future day) — Rule 24 pass.

## Seeded records (DVI Test, all named ZZAUTOTEST — kept so the drafts stay reproducible)
`results-seeded-records.json`: customer "ZZAUTOTEST PV Customer" (contact "ZZAUTOTEST PV Contact", asset ZZ-PV1); catalogue + inventory parts ZZAUTOTEST-PV1-10282011 (now 4 in stock), ZZAUTOTEST-SO1-10282011 and ZZAUTOTEST-SO2-10282011 (0 in stock); work orders S1-38203 (invoice reversed once, re-invoiced), S1-38204, S1-38206 (made/finished on screen, reversed once, re-invoiced); vendor order with invoice ZZPV10282011; one Parts → Returns vendor return (cancelled — stock restored). Invoices are unpaid.

## Tools (`tools/`)
`common.py` (private session, paged reads) · `pv_collect.py` · `iv_collect.py` · `parts_collect.py` · `filter_collect.py` · `pv_internal.py` · `pv_recompute.py` · `pv_movement_probe.py` · `iv_check.py` · `filter_check.py` · `sort_check.py` · `seed_pv.py` / `seed_read.py` · screen: `ctx2.mjs`, `pv_screen.mjs`, `screen2.mjs`, `screen3.mjs`, `repro_ui_a.mjs` / `repro_ui_b.mjs` / `repro_ui_c.mjs`, `evidence.mjs` · `mint_w3.mjs`. Raw responses in `/tmp/cln/dv/w3/` (staging data, not for git).
