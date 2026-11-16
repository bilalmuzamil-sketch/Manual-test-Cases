# Report gaps + Dashboard S12-R7–R10 — staging, 16 Nov 2026

**Environment:** staging `app.staging.shopview.com` / `api.staging.shopview.com`, build **`v26.45.4-f3d3d2d`** (read 06:36 and 06:41 UTC, 16 Nov). Role Admin (quick-login from the QA lead's staging sign-in). TestRail and Jira: **no writes**.
**Locations and zones, read live from `GET /api/staff/my-workplaces` at 06:36 UTC:** Staging Heavy Duty - 9919 = Asia/Karachi · Staging Lethbridge - 4310 = America/Edmonton · QB Location = America/Vancouver · **DVI Test = Pacific/Fiji** (it was America/Toronto on 28 Oct; every re-run uses Fiji).
**Rule 99:** API-only checks switch the session with `change-location` to the location's zone before each location and compute every window with that location's zone; the process `TZ` is recorded per run. Screen checks record all four settings (session, browser `timezoneId`, process `TZ`, `localStorage['timezone']`) plus the offsets from `tz_rules_check.py`.


## Summary (16 Nov 2026, 06:28–08:20 UTC, build v26.45.4-f3d3d2d unchanged throughout)

| Area | PASS | Differs / FAIL | NOT VERIFIED | Other |
|---|---|---|---|---|
| 1 · Figures re-run (22 report checks) | 15 hold with no new kind of failure | 0 new defects; 3 **behaviour changes since 28 Oct**, each explained (TU open clocks → SV-11688 Ready for Production; Technician Efficiency no longer lists declined lines (F2); Inventory Value counts negative bins → SV-10380 Ready for Production) | A/R ×3 + A/P ×3 (rebuilt under SV-11315, old tools obsolete); 5 TU rows still open | Export Reports: X-INV5 now PASS |
| 2 · Downloads, columns, sorting, accessibility (16 reports) | 45 checks | 3 differences, **all already reported and closed OBSOLETE 9 Aug** (SV-8956, SV-8950, SV-8951) | 6 (A/R/A/P headers other than the name column) | 6 reports: NO SOURCE (facts recorded) |
| 3 · Edge cases (8) | 4 (TU S2-R8a; X-PAY1 125/125; deposits 20/20 + refund rows 33/36; part-sale population 413/413) | 0 | 1 (core charge: part seeding recipe broken on this build) | 2 NO SOURCE (not producible either); 1 environment-blocked (S2-E3: default rate cannot be deleted) |
| 4 · Shop Efficiency vs clocked time | settled | — | — | **BY DESIGN** (SV-2116 c14920 vs SV-9447 c75562) |
| 5 · Dashboard S12-R7–R10 | R7 40, R8 20, R9 20, R10 24 | 0 | R8 on TE/TU (20): too few rows to scroll | 16 not applicable |

**Candidate defects / questions drafted: none.** Every difference found is either already in Jira (closed Obsolete — a QA lead decision, Rule 94 A4), a behaviour change that matches a shipped ticket, or has no written source. One apparent defect (A/P PDFs "no file, no message") was disproved on screen before drafting (S3-N1 message shown). So there are no `D<n>`/`Q<n>` folders.

**For the QA lead (each names its ticket and a recommendation, Rule 102):**
1. [SV-8956](https://shopview.atlassian.net/browse/SV-8956) (closed Obsolete 9 Aug, no comment) — Sales By Customer file names still leave out the range; SBC spec v22 (20 Oct) S14-R14 still requires it. *My recommendation: reopen with the 16 Nov repro and ask Chris "fix it, or leave it as it is?"*
2. [SV-8950](https://shopview.atlassian.net/browse/SV-8950) (closed Obsolete 9 Aug) — Technician Utilization CSV still has no Summary row; TU spec v9 S7-R7 requires it. *My recommendation: reopen, same way.*
3. [SV-8951](https://shopview.atlassian.net/browse/SV-8951) (closed Obsolete 9 Aug) — TU CSV names and per-day Expanded CSV: TU v9 S7-R12/S7-R7 say one summary-level CSV, but S7-R4a adds an Expanded CSV option. *My recommendation: a question to Chris (the spec contradicts itself), not a reopen.*
4. [SV-10380](https://shopview.atlassian.net/browse/SV-10380) (Ready for Production) — Inventory Value now lists negative on-hand parts; IV spec v10 S2-R1 says on-hand > 0. *My recommendation: read SV-10380's text, then ask Chris which governs if it does not say.*
5. No ticket yet (related [SV-11315](https://shopview.atlassian.net/browse/SV-11315)) — the A/R and A/P figure checks need rebuilding on the new endpoints and PRD 947650561. *My recommendation: approve as the next worker task.*
6. No ticket yet (related: 28 Oct finding F2, held with DQ-1) — Technician Efficiency no longer lists declined lines. *My recommendation: re-check the dashboard Technician Efficiency tile for F2 before F2/DQ-1 is mentioned again.*

---

## Area 1 — Re-check of every report's figures on the current build

**How:** the 28 Oct W1–W4 tools were copied to `area1/` with their output paths redirected (28 Oct evidence untouched) and DVI Test's zone set to its live value (Pacific/Fiji). Five lanes, each on its own quick-login session, ran `area1/run_area1.sh` (06:41–07:59 UTC, build v26.45.4-f3d3d2d at every step's start; resumable; a second pass re-ran the steps that had failed on a missing output folder). Every location was switched with `change-location` to its own zone, and every window was computed in that zone (process `TZ` Asia/Karachi; Rule 99 (c) is met by the per-location zone code, not by the process zone; recorded). Fixed historical windows (Last Year, 15 Sep–14 Oct, the A/R as-of dates, September exports) are directly comparable with 28 Oct; rolling presets now cover different dates.
**Caveat:** the 28 Oct raw responses were in `/tmp` and are gone, and four of the 28 Oct W2 result files were never committed, so "figure changed" is judged from the failure lists and the totals in `ShopView-Dashboard-and-Reports-Full-Check-2026-10-28.md`.

| Report (tool) | 28 Oct PASS / FAIL | 16 Nov PASS / FAIL | What changed and why | Evidence |
|---|---|---|---|---|
| Work In Progress — internal (A) | 246,643 / 0 | 226,368 / 0 | none | `area1/W1-labor-wip/results-wip-internal.json` |
| Work In Progress — filters | 500 / 0 | 500 / 0 | none | `results-wip-filters.json` |
| Work In Progress — independent recompute (C) | 4,296 / 611 | 4,680 / 640 | same kinds as 28 Oct (Fixed-Line-Total split 315→333, unclassified 187→197, 1 new part adjustment); more open work orders | `results-wip-oracle.json`, `compare-28oct-16nov.json` |
| Technician Utilization | 2,398 / 97 (+ part 2: 341 / 37) | 1,317 / 83 (+ 199 / 4) | **Behaviour change:** never-clocked-out timesheets are now left out (19 rows; SV-11688 is **Ready for Production**), so the 28 Oct finding F1 no longer shows. Remaining: 8 = clocks that round to 0.00 h (held SQ-6); **5 open:** a technician with under 24 h of clocks left out (3 on Today, clocks running) — not yet checked against the SV-11688 ruling text or on screen | `results-tu.json`, `results-tu2.json` |
| Timesheet Activities | 119,892 / 51 | 118,749 / 54 | same kinds (SV-10698 open clocks / footer) | `results-ta.json` |
| Shop Efficiency | 119 / 25 | 134 / 10 | fewer rounding/open-clock mismatches; the clocked-hours gap is settled in Area 4 (by design) | `results-se.json` |
| Sales | 96,171 / 1,079 | 100,773 / 1,156 | same kind as 28 Oct (Stats tab changed after invoicing; the invoice record is the authority) | `area1/W2-sales-advisor-tax/results-sales.json` |
| Service Advisor Analysis | 112,690 / 601 | 118,206 / 633 | as Sales | `results-saa.json` |
| Sales By Customer | 129,838 / 14,337 | 135,669 / 14,499 | same kinds (SQ-1/SQ-4/SQ-10 spec-vs-ticket rows) | `results-sbc.json` |
| Sales By Representative | 146,093 / 1,491 | 152,409 / 1,135 | fewer | `results-sbr.json` |
| Technician Efficiency | 1,089,118 / 834 | 1,027,555 / **1** | **Behaviour change:** declined lines are no longer listed ("Line is not a declined line" 84,880 / 0; 28 Oct: 101 failures = finding **F2**), and the 727 tiny-clock failures are gone. Which ticket shipped this was not identified; F2 (held for Chris, DQ-1) should be re-checked on the dashboard tile before anything more is said about it | `results-te.json` |
| Sales Tax Collected | 479,522 / 12,408 (+ status 83,298 / 5,666) | 485,342 / 12,110 (+ 84,516 / 5,392) | same kinds (TAX1/TAX2) | `results-tax.json`, `results-tax-status.json` |
| Sales — customer filter; SBC/SBR all-locations | 771 / 0; 8 / 0 | 907 / 0; 8 / 0 | none | `results-sales-customer-filter.json`, `results-multi.json` |
| Parts Velocity — internal | 1,992,025 / 168 | 1,983,128 / 152 | same check (special-order Last Sale, PV-D1 family) | `area1/W3-parts/results-pv-internal.json` |
| Parts Velocity — recompute | 103,015 / 18,920 | 97,416 / 18,410 | fewer; not re-broken down by category this pass | `results-pv-recompute.json` |
| Parts Velocity / Inventory Value — filters, sort | 3,350 / 5; 52 / 10 | 3,407 / 7; 52 / 10 | +2 filter reads answered HTTP 400 (not investigated) | `results-filters.json`, `results-sort.json` |
| Inventory Value | 798,725 / 1 | 767,128 / **231** | **Behaviour change:** negative bins now count (bins 36 and −4 show Qty 32) and parts with negative on-hand are listed (179 rows with qty ≤ 0; 31 presence and 17 Qty mismatches against the 28 Oct rule). **SV-10380** "Inventory Value report ignores negative bins…" is **Ready for Production** (updated 13 Nov). The IV spec (720142338) is still **v10, 13 Aug**, whose S2-R1 says a row shows only when on-hand > 0 — the spec and the shipped ticket now differ; SV-10380's text was not re-read in this pass. Also 1 HTTP failure on one Heavy Duty past day, and 2 All-locations unions off (one caused by that failed read) | `results-iv.json` |
| A/R Aging ×3, A/P Aging ×3 | 756 / 68 (all W4) | **NOT VERIFIED** | **The six reports were rebuilt after 28 Oct** (SV-11315 Phase 5, merged 5 Nov: legacy endpoints removed, now `reporting/reports/ar-aging-*` / `ap-aging-*`; PRD 947650561, 13 Nov). The 28 Oct tools call the removed endpoints (404 "'resource' was not found."). Unblock: rebuild the A/R/A/P recompute against the new endpoints and the new PRD (screen features are covered in Area 2) | W4 log |
| IBS Batches | 40 / 4 | 40 / 4 | none | `area1/W4-finance-accounting-comms/results-ibs.json` |
| Notes / Reminders | 244 / 32 | 234 / 42 | same check (N2 "every note in the range is listed" — the 100-note cap, NOTES1); more notes now hit it | `results-notes-reminders.json` |
| QB Unexported | 56 / 4 | 54 / 6 | same checks (Q3 blank number, Q4 listed twice), +1 each with new data | `results-qb-unexported.json` |
| Export Reports (Heavy Duty, September — same window as 28 Oct) | 13 / 5 | 13 / 4 + 1 not run | **X-INV5 (Terms) now PASS** (was RQ-7); X-INV3/X-INV4 still FAIL (RQ-9, time zone); X-PR2 still FAIL for September, PASS for October; X-PAY1 still FAIL in this tool — superseded by Area 3's row-by-row check (125 / 125 match); X-VB1 not run (needed the retired A/P Detail endpoint) | `results-exports-hd_sep.json`, `results-exports-hd_oct.json` |

---

## Area 4 — Shop Efficiency "Total Clocked Hours" vs clocked time — **SETTLED: BY DESIGN (no ticket)**

**The 28 Oct gap, re-read 16 Nov (paired reads, own session, process TZ = location zone):**

| Location · range | Shop Efficiency clocked | Technician Utilization total | Gap | 28 Oct figure |
|---|---|---|---|---|
| Heavy Duty · This Year (1 Jan–16 Nov 2026, Asia/Karachi) | **14,994.43 h** | **15,765.24 h** | −770.81 h | SE 14,994.03 h (unchanged data; +0.40 h) |
| Lethbridge · Last Year (2025, America/Edmonton) | **10,762.85 h** | **8,709.03 h** | +2,053.82 h | identical (10,762.85 / 8,709.03) |

**What explains it (records found):** the two reports use different rules for a person whose *billable* setting changed.
- **Shop Efficiency** counts a clock when the clock itself was recorded as billable, i.e. the person was billable *at the time of clocking* (each clock record carries its own billable flag; observed on every work-order clock in `GET /api/technician-tasks/list`).
- **Technician Utilization** counts the people who are billable *today* (observed: the department hours of people billable today = **2,316.92 h**, exactly TU's internal hours 2,316.91 h).

| | Heavy Duty, This Year | Lethbridge, Last Year |
|---|---|---|
| A. Work-order clocks recorded billable, by people **not** billable today (in SE, not in TU) — observed | 138.33 h | **1,881.48 h** |
| B. Work-order clocks recorded **not** billable, by people billable today (in TU, not in SE) — observed | 7.20 h | 0.00 h |
| C. Department hours of people billable today that SE does not count (TU internal − SE's department part) — observed totals | **874.95 h** | −178.72 h (SE counts 178.72 h more: people billable then, not now) |
| A − B − C vs the gap | −743.82 vs −770.81 (26.99 h left) | 2,060.20 vs 2,053.82 (6.38 h left) |
| Department clocks' own flag (no read endpoint exposes it) — **INFERRED** from each person's nearest work-order clock flag: predicted SE | 14,966.44 h (−27.99 h) | 10,757.38 h (−5.47 h) |

- Work-order clocks recorded not billable at Heavy Duty this year: **377 clocks, 570.14 h, 25 people**, every one of them not billable today either (e.g. S2-31932, 20 Aug 2026 2:00–5:00 PM, 3.00 h).
- **The 26.99 h left at Heavy Duty is NOT in Shop Efficiency:** it is TU work-order time above the same people's closed clocks (10 people, 0.5–4.3 h each, net 26.57 h). It belongs to the Technician Utilization re-check (Area 1), not to this question.

**Source (re-read live 16 Nov, Rule 59):**
- **SV-2116** "Create 'Shop Billing Efficiency' report" (Done), PO Fabian Bonjean, **comment 14920, 12 Mar 2024**: *"It should change from counting the hours at the time of switching it. So in the scenario you describe, it should still count the January hours as billable, but not the hours going forward. Same thing the other way around. If they are not billable in january, and in Feb they switch to billable, their January hours should not show up, since they just switched to billable in February."* Confirmed in **comment 14927**: *"Yes, that makes sense. … only for hours going forward."*
- **SV-9447** (Done), Chris Ward **comment 75562, 24 Aug 2026**, answering *"The report will read the flag as it stands today … their hours drop out of every historical report as well"* (comment 75561): *"That's just fine, this should have probably been a part of the original spec"*.

**Verdict:** BY DESIGN — Shop Efficiency follows SV-2116 (billable at the time of clocking); Technician Utilization follows SV-9447 (billable today). Each report does what its own source says, so the two can differ for anyone whose billable setting changed. No ticket, no question needed (both sources are explicit).
- Related, already filed (not re-raised): **SV-11939** "Reports - Shop Efficiency leaves a running timesheet out of Total Clocked Hours" — Open, parked in SV-11936; our comment 80582 (10 Nov) asking Milos Vasic / Chris Ward which epic; no reply (checked 16 Nov ~07:00 UTC).
- Not tried: creating a read-only Public API key to read each department clock's own flag directly (the session's permission system refused the credential creation). The department side therefore rests on the observed totals plus the labelled inference above.

Evidence: `area4/se-gap-hd_this_year.json`, `area4/se-gap-leth_last_year.json` (totals, counts, reconciliation, no names); tools `area4/tools/se_gap.py`, `se_decompose.py`, `se_residual.py`. Raw reads (with names) stay in `/tmp/cln/rg16/a4/`.

---

## Area 5 — Dashboard PRD S12-R7 to S12-R10 (Story 12, visual conformance)

**Source:** Dashboard PRD, Confluence 788430850 **v53** (last modified 22 Oct 2026 — unchanged since our 28 Oct read; checked by CQL 16 Nov). Wording:
- **S12-R7:** *"On a 1536 × 864 screen at 100% zoom, a report showing its chart still shows table rows under the chart and lets the user scroll through them, without zooming out or hiding the chart (SV-10933)."*
- **S12-R8:** *"With the chart showing, scrolling the table under it moves only the table rows; the chart and filters stay in place (SV-10934)."*
- **S12-R9:** *"An open date picker on a tile never floats away from its tile. Scrolling with the pointer over the picker does not scroll the page (SV-10936)."*
- **S12-R10:** *"A chart filter list that opens upward stays below the top menu bar and never covers it, for example by being shorter and scrolling inside (SV-11242)."*

**Set-up:** Staging Heavy Duty - 9919, build v26.45.4-f3d3d2d at start and end; session, browser `timezoneId`, process `TZ` and `localStorage['timezone']` all **Asia/Karachi**; browser and machine offsets agree (+05:00; `tz_rules_check.py` MATCH). Sizes 1920×1080, 1536×864, 1280×800, 1024×768, 390×844, light and dark (theme restored to Light at the end). Every verdict is measured from box positions (`area5/s12_r7_r10.mjs`, `area5/r8_followup.mjs`), 07:0x UTC.

| Rule | What was checked | Result | Evidence |
|---|---|---|---|
| S12-R7 | Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization (the four reports with a chart): chart shown, ≥1 full table row visible under it, table scrollable when it has more rows | **PASS 40/40** (4 reports × 5 sizes × 2 themes). At 1536×864: Sales 7 rows under the chart, SAA likewise; TE 3, TU 3 | `area5/evidence/s12-r7-r10.json`, `light-1536-*.png` |
| S12-R8 | Wheel over the rows: rows move inside the table, chart top unchanged, window does not scroll | **PASS 20/20** (Sales, SAA × 5 sizes × 2 themes: e.g. Sales 1536 light, table scrollTop 0→400, chart top 113→113, window 0→0). **NOT VERIFIED 20** (TE, TU): at Heavy Duty the table never had more rows than fit under the chart (3–5 rows), so there was nothing to scroll; switching the report's own date filter to Last 12 Months did not add rows (applying the range was not confirmed). Unblock: a location or range with more technician rows than fit under the chart. | `s12-r7-r10.json` (`R8_rescored`), `s12-r8-followup.json` |
| S12-R9 | Revenue and Sales by Customer tile pickers: wheel over the open picker, then over the page | **PASS 20/20**: the page never scrolled while the pointer was over the picker, and the picker kept its exact offset from its tile (e.g. 1536 light Revenue: offset −116/−228 before and after). At 390 px the picker opens as a dialog | `s12-r7-r10.json`, `light-1536-r9-revenueKpi.png`, `dark-1536-r9-revenueKpi.png` |
| S12-R10 | Detail panels of Billing Efficiency, Technician Efficiency, Technician Utilization: chart filter chip pushed to the bottom edge, list opened | **PASS 24/24**: every list stayed below the top menu bar and inside the window. Revenue has no chart filter chip (8 × not applicable); at 390 px the tiles have no "details" button (8 × not applicable) | `s12-r7-r10.json`, `light-1536-r10-*.png`, `dark-1536-r10-*.png`, `light-1024-r10-*.png` |

**Not part of S12 but seen on the Sales screenshot (queued for a second reproduction and a duplicate search):** at 1536 px the pinned **Subtotal** column overlaps the column to its left (Totals row "$55,"' run into "$61,721.23"; stray "$" / ":" beside the row cells). The Sales report has no written spec, so at most this becomes a question for Chris.

---

## Area 3 — Edge cases never verified on 28 Oct (seeded where possible)

| Edge case | Source (version) | Result | Evidence |
|---|---|---|---|
| "(No company)" row, Sales By Customer | **No source.** SBC spec 577634305 **v22** (20 Oct) has no such row (searched "No company", "no customer", "without a company", "unassigned", "walk-in"); the 28 Oct expectation came from the code-derived column reference | **NO SOURCE — not checked as a requirement.** Also not producible: work order create and part sale create both answer **400 `company_id` "Missing required parameter"** (DVI Test, 07:1x UTC) | `seed-log.jsonl` |
| "Inv. Hrs from the newest invoice", Sales | **No source** (code-derived column reference only) | **NO SOURCE.** Not producible either: a second invoice on an already-invoiced work order (S-39422's order, DVI Test) is refused **400 "Work order is not complete."** | `area3/second-invoice.json` |
| Est. Lost Labor "—" for a location with no labor rate | TU spec 641400833 **v9** (13 Aug), **S2-E3**: *"If a technician has internal hours but none of the location(s) where those hours were clocked has a default labor rate configured, Est. Lost Labor is unknown and shows "—""* | **BLOCKED — environment, fully characterised:** every location gets a default "General Labor" $135 when created (both ZZAUTOTEST locations, read 16 Nov), and deleting a location's default is refused: **400 "This labor rate cannot be deleted because it is set as the location default. Please select another default labor rate before attempting to delete it."** So no location without a rate can exist on this build. | `area3/tu-rate-results-run1-session-shared-INVALID.json` (the delete step is valid; see note), `seed-log.jsonl` |
| Rate change S2-R8a | TU v9 **S2-R8a**: *"The rate applied is the default labor rate that was in effect when the hours were clocked, not the location's current rate — changing a location's rate never revalues previously clocked internal hours."* | **PASS.** ZZAUTOTEST V1R-87 Location C (America/Edmonton, process TZ and session zone Edmonton; API reads, times away from midnight): rate 135→100 (07:04 UTC), 2-min clock; →200 (07:07), 2-min clock; Est. Lost Labor today **$9.00** = 0.03 h × $100 + 0.03 h × $200 (current-rate valuation would be $12.00); restored to $135 (07:10): still **$9.00**; the Nov 10 2-h clock stays **$270.00** (2 h × $135) throughout. Clocks deleted (204), rate back to $135. *Observation:* each 2-minute clock counted as 0.03 h (108 s), not 0.0333 h — related to held question SQ-6, not raised. | `area3/tu-rate-results-run2.json` |
| Attached core charge (SV-10379, Inventory Value) | SV-10379 "Inventory Value report excludes attached core charges and understates inventory cost" — **Blocked** (checked 16 Nov) | **NOT VERIFIED.** The 28 Oct seeding recipe no longer works on v26.45.4: `POST /api/parts-catalogue/add-catalogue-part` answers **404 "'resource' was not found."** for 12 categories at DVI Test, and `POST /api/inventory/parts/create` without a catalogue part answers **400 "Part number is required." / "Description is required."**. The behaviour's own ticket is Blocked (fix not built), so this belongs in the not-built re-check queue. Unblock: the current way to create a catalogue part (the Parts screen "New part" flow), then set a core charge and read Inventory Value. | `seed-log.jsonl`, `area3/core-part.json` |
| Export Reports X-PAY1 (the 16 unverified payment rows) | No written spec for export layouts (28 Oct searches) — record agreement | **PASS: all 125 invoice-payment rows** of Customer Payment (Heavy Duty, 1–30 Sep 2026, 181 rows — same window and row count as 28 Oct) match the customer's Payments list (amount and date in Asia/Karachi). 2 of the rows carry a customer name shared by two customers, so the file alone cannot say which one (observation) | `area3/payment-export-rows.json` |
| Customer Payment: deposit, refund and credit rows | as above | **Deposits 20/20 PASS** (DEP number, amount, date). **Rows with no invoice 33/36 PASS** (refunds, excess and overflow payments, matched by memo/amount/date). **3 unmatched: all $0.00 Cash rows** (09-15, 09-18, 09-22) with no $0.00 record on that day — observation only (no written source for the export) | `area3/payment-export-rows.json` |
| Sales report part-sale population (all part sales, not 80 of 258) | Dashboard PRD v53: Revenue = *"Sum of invoice subtotals in the selected range … minus credit memos"*, report = Sales; S3-E2 (void excluded) | **PASS.** Full part-sale list, every page: Heavy Duty 523 (260 invoiced/paid since 1 Jan 2025), Lethbridge 169 (149), QB 5 (5), DVI Test 0. **413 / 413 part sales with an invoice are listed in Sales** (Last Year + Last 12 Months). The one not listed, **P2-2248** (Heavy Duty, "Paid"), has **no invoice at all** (`is_invoice_created: false`, total $0.00, a ZZAUTOTEST customer), so it correctly has no Sales row | `area3/part-sales-population.json` |

**Note on run 1 of the rate test:** my first run shared a session with another script that switched the session's location while two clocks were being created, so its "today" figures are void (kept as `tu-rate-results-run1-session-shared-INVALID.json` for the record; its delete-default refusal and the Nov 10 reading are unaffected). Run 2 used its own session.

---

## Area 2 — Downloads, column chooser and its memory, sorting, basic accessibility (16 reports)

**Set-up:** Staging Heavy Duty - 9919, build v26.45.4-f3d3d2d, 1536×864, light; session, browser, process `TZ` and `localStorage['timezone']` = Asia/Karachi (offsets agree). Every download was saved to `/tmp` and opened (CSV parsed, PDF text read); only extracted values are committed. Tools: `area2/collect_screen.mjs` (facts), `area2/followup.mjs` (toggle switches, header clicks, second download run), `area2/ap_pdf_message.mjs`, `area2/resort_check.mjs`, `area2/check_area2.py`. 07:00–08:00 UTC.
**Sources re-read 16 Nov (Rule 59):** WIP 703660034 v28 (24 Aug), TU 641400833 v9 (13 Aug), SBC 577634305 v22 (20 Oct), SBR 585629698 v30 (21 Oct), and the **new** A/R and A/P PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence **947650561** (Chris Ward, last modified 13 Nov 2026) — the six aging reports were rebuilt under it (SV-11315 Phase 5, merged 5 Nov).

| Report | Check (source quote) | Result | Evidence |
|---|---|---|---|
| Work In Progress | S9-R1 menu "Download (PDF)" / "Download (CSV)"; S9-R9 files "wip-2-report.pdf" / ".csv"; S9-R11 "Data exported successfully." | **PASS** ×3 (two runs) | `area2/evidence/screen-facts.json`, `followup-run1-sorting-downloads.json` |
| Work In Progress | S9-R2 *"only the columns currently shown, in the same left-to-right order as the screen, with Total last"* (S9-E1 Unit/Branch renames); S9-R4 *"a Totals row matching the on-screen Totals row"*; S9-R10a "Locations:" line | **PASS** ×3 (CSV header = screen; Totals $219,351.82 / $211,910.15 / -$3.13 / $431,258.84 both sides; "Locations: Staging Heavy Duty - 9919") | `area2/evidence/area2-checks.json` |
| Work In Progress | S8-R7 *"remembers … column selection … and restores them on the user's next visit"* | **PASS** (Adjustments hidden → still hidden after reload → restored) | `followup-work-in-progress_…json` |
| Technician Utilization | S7-R2/R3/R4/R4a the four menu labels; S8-R16 Column Selection has an accessible name; S8-R10 `aria-sort` ascending on Technician, none on the others, descending after one click on the label; S2-R13 all six columns sort; S10-R6 column memory; S7-R13a "Locations:" line in the CSV | **PASS** ×6 | as above, `resort-check.json` |
| Technician Utilization | S7-R12 *"…named "Technician-Utilization-Summary.pdf", "Technician-Utilization-Expanded.pdf", and "technician-utilization.csv""*; S7-R7 *"The CSV file shows the technician rows and the Summary row … does not vary by the summary/expanded choice"* | **DIFFERS** (two runs): two CSVs, "Technician-Utilization-Summary.csv" / "…-Expanded.csv"; the Expanded CSV has per-day rows (9 lines vs 4); **neither CSV has the Summary row** (screen: "Summary 0.40 0.40 0.00 100.00% $0.00"). **Already reported and closed OBSOLETE 9 Aug with no comment: SV-8951 and SV-8950** → QA lead decision, not a new ticket | `area2-checks.json` |
| Sales By Customer | S14-R2 / S15-R2 menu labels; S13-R6 Customer and Subtotal not in the toggle list; S13-R8 column memory; S10-R1 every column sorts (all 12 toggle ascending/descending); S14-R13 "Locations:" line | **PASS** ×5. Expanded View (PDF) arrives after **74 s** (first run gave up at 45 s) | as above |
| Sales By Customer | S14-R14 *"the Summary CSV is sales-by-customer-summary-{range}.csv … This Month → this_month"* | **DIFFERS** (two runs): "sales-by-customer-summary.csv", "…-expanded.csv", ".pdf" — no range. **Already reported: SV-8956, closed OBSOLETE 9 Aug, no comment** → QA lead decision | as above |
| Sales By Representative | S14-R1 four menu actions; S14-R11/R15/R16 file names; S20-R3 the five fixed columns not in the toggle list; S20-R5 column memory; S11-R1 financial columns sort (Date/Invoice/Customer/Status do not) | **PASS** ×5 | as above |
| A/R Aging Summary / Detail / Collection, A/P Aging Summary / Detail / Unpaid Invoices | S3-R1 *"the native report Export menu (the ⋯ button …, labelled "Export report") with "Download (PDF)" and "Download (CSV)""*; S3-R4/R5/R8 CSV opens "As of: Nov 16, 2026" then "Locations: All locations"; S3-R10 success message | **PASS** 6/6 each | as above |
| A/P Aging Detail, A/P Unpaid Invoices | S3-N1 *"Over 2,000 rows, the PDF is refused … no download, and the message "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.""* | **PASS** (2 runs each): no file; the screen shows exactly that warning; the server answers 400 with the same words. (A first reading of "no message" was my tool reading the screen too late — corrected.) | `area2/evidence/ap-pdf-too-large.json`, `ap-aging-detail-pdf-too-large-run1.png` |
| A/R and A/P Summaries | S2-R3 *"A header that is already the sorted column reverses on its first click"*; S2-R2 money columns largest first | **PASS**: Customer / Vendor ascending → descending → ascending, rows reverse; bucket columns descending on first click | `resort-check.json`, `followup-ar-…json` |
| A/R and A/P (all six) | S2-R1 *"Every column … sorts when its header is clicked"* — Location, Total, ID / No., Amount and some Due Date headers | **NOT VERIFIED**: my clicks landed on the header cell's middle, which on several headers holds another control; those clicks showed no sort state, and the label-click method that proved the name columns was not repeated for every header. Unblock: re-run `resort_check.mjs` over every header label | `followup-ar-…json` |
| Shop Efficiency, Timesheet Activities, Timesheets, Sales, Service Advisor Analysis, Technician Efficiency | downloads / columns / sorting / accessibility | **NO SOURCE** — no written rule found (28 Oct searches; their Jira sources describe calculations only). Facts recorded: only Technician Efficiency has a download menu ("Download Summary" / "Download Expanded View", PDF); none has a column chooser; sortable headers SE 4/4, TA 5/13, Timesheets 12/13, Sales 13/13, SAA 4/18, TE 4 | `area2-checks.json` |

**Accessibility facts (all 16):** the export and Column Selection buttons are reached with Tab and the export menu opens with Enter wherever they exist; counts of controls without an accessible name are recorded per report in `screen-facts.json`. Only TU S8-R16 / S8-R10 and WIP S10 carry written accessibility rules (checked above); the rest is recorded, not judged.
