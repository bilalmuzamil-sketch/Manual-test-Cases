# Report gaps + Dashboard S12-R7–R10 — staging, 16 Nov 2026

**Environment:** staging `app.staging.shopview.com` / `api.staging.shopview.com`, build **`v26.45.4-f3d3d2d`** (read 06:36 and 06:41 UTC, 16 Nov). Role Admin (quick-login from the QA lead's staging sign-in). TestRail and Jira: **no writes**.
**Locations and zones, read live from `GET /api/staff/my-workplaces` at 06:36 UTC:** Staging Heavy Duty - 9919 = Asia/Karachi · Staging Lethbridge - 4310 = America/Edmonton · QB Location = America/Vancouver · **DVI Test = Pacific/Fiji** (it was America/Toronto on 28 Oct; every re-run uses Fiji).
**Rule 99:** API-only checks switch the session with `change-location` to the location's zone before each location and compute every window with that location's zone; the process `TZ` is recorded per run. Screen checks record all four settings (session, browser `timezoneId`, process `TZ`, `localStorage['timezone']`) plus the offsets from `tz_rules_check.py`.

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
