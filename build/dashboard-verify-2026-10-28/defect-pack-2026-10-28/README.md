# Dashboard — full independent pass, 28 Oct 2026 · defect pack

**Build:** staging `v26.43.2-f8698cb` (develop f8698cbc1, deployed 2026-10-28 13:56 UTC) · **Expectation source:** Dashboard PRD v53 (Confluence 788430850, 2026-10-22) · **Locations:** Staging Heavy Duty - 9919, Staging Lethbridge - 4310, QB Location, DVI Test · **Role:** Admin · **TestRail:** not touched (QA lead: "NO") · **Jira:** nothing filed (per-ticket permission + hold H1)

## What was checked (every figure, every filter, every date range)

| Layer | What | Checks | Result |
|---|---|---|---|
| A · Self-consistency | 17 data keys × 4 locations × 9 presets + 7 custom ranges: bucket size (S4-R11/R11c), one point per bucket, sparkline/bars add up to the headline, Parts+Labor+Other = 100, ratio = its two hour figures, tables add up to tiles, At Risk 12 points / last = headline / test met / longer window never adds | 1,185 | 1,181 ✅ · 4 = 367-day API acceptance → Rule 24 pass (picker blocks it) |
| B · Tile = report (S3-R1) | Every tile, every advisor / technician / top-customer row, and each report's own preset by name, paired reads | 2,592 | **2,592 ✅** |
| C · Independent recompute from raw records | 8,036 invoices against their own invoice records; invoiced work orders missing from Sales; invoiced hours against the lines on each invoice; worked hours and the technician-time split from each line's own clock records; At Risk from full invoice history | 40,180 + 8,036 + 5,425 + 87 + 20 | all ✅ except: F2 (declined lines in Technician Efficiency), F3 (API-only), 4 × 1-cent parts rounding |
| L1 · Screen = server, PRD wording | Headline + supporting line + empty-chart rule + pill + other tiles unchanged, every tile × preset × location; At Risk × 5 windows | 1,184 | **1,184 ✅** |
| L1b · Expanded panels + report links | Every rendered table row vs server; one panel open; each report link lands on its report and preset; At Risk has no link | 121 | **121 ✅** |
| L1c · Chart filters (Story 8) | Untick one technician / pick one advisor → chart + table narrow, tile unchanged; untick all → chart + table hidden; choice remembered after reload | 9 | **9 ✅** |
| D · Seeded known data (DVI Test) | New invoice shows at once (S3-R1); reversed invoice drops from every figure; credit larger than sales → **-$15.00** (S3-E1); "-" with nothing to divide (S3-E3); 366-day picker cap (S7-R2a); Today button; discount; declined line; line added after invoicing | 12 scenarios | F2 + F4 held for PO; F3/F5 API-only; rest ✅ |

## Findings

| # | Finding | Status | File |
|---|---|---|---|
| F1 | Technician Utilization counts never-clocked-out timesheets | **Already reported — SV-11688** (still reproduces) | NOT-FILED.md |
| F2 | Technician Efficiency counts lines the customer declined | **Drafted, HELD for PO (DQ-1)** — reproduced 3 times, once screen-only | DEFECT-CANDIDATE-tech-efficiency-counts-declined-lines.md · TICKET-F2-…wiki · F2-pictures/ |
| F4 | Revenue is after a work-order discount; PRD says "before any discount" | **Drafted, HELD for PO (DQ-2)** — reproduced twice, once screen-only | DEFECT-CANDIDATE-revenue-takes-off-work-order-discounts.md · TICKET-F4-…wiki · F4-pictures/ |
| F3, F5 | Lines added to Paid / Invoiced work orders (hours counted; pending invoice grows while the customer owes the old amount) | API-only → Rule 24 pass; API-hardening note | NOT-FILED.md |
| O1–O8 | Observations | not tickets | NOT-FILED.md |

**Arrangement:** duplicate searches are pack-level (`DUPLICATE-SEARCH.md`); each candidate file carries its own self-challenge (A9).
Test data left on staging (all ZZAUTOTEST, DVI Test): customers "ZZAUTOTEST Dash A1", "ZZAUTOTEST Dash F2"; work orders S1-38195, S1-38196, S1-38198, S1-38199, S1-38200; credit memo CM1-4535 ($400.00); clock records for Esther Howard and Fabian Bonjean on 27 Oct 2026.
