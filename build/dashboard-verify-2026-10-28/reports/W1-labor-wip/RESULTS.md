# W1 — Labor reports + Work In Progress: FULL pass results (28 Oct 2026)

Build `v26.43.2-f8698cb` on staging, checked at the start (19:4x UTC) and the end (20:41 UTC) — unchanged.
Reports: Work In Progress · Technician Utilization · Shop Efficiency · Timesheet Activities · Payroll Timesheet (hidden page).
Locations: Staging Heavy Duty - 9919 (Asia/Karachi) · Staging Lethbridge - 4310 (America/Edmonton) · QB Location (America/Vancouver) · DVI Test (America/Toronto), plus all four together where the report allows it.
Nothing written to TestRail or Jira. Seeded throwaway data only in DVI Test (list at the end).

## Totals

| Report | Checks run | PASS | FAIL | INFO | Findings |
|---|---|---|---|---|---|
| Work In Progress — internal consistency (every row, tab, totals row, strip; 5 scopes × 5 as-of days) | 246,662 | 246,643 | 0 | 19 | Days Open (D1, HELD) |
| Work In Progress — independent recompute from raw work-order records (4,907 rows today) | 4,907 | 4,296 | 611 | — | all 611 explained (below); N1 Rule-24 |
| Work In Progress — filters (Advisor, Customer, both) | 500 | 500 | 0 | — | — |
| Work In Progress — seeded known-data (fixed price ×2, fee/discount, Estimates split, completion) | 7 | 4 | 3 | — | the 3 FAIL = N1 (API-only state, 3 stages of S1-38201) |
| Work In Progress — screen = server (DVI, HD: tab counts, 7 strip figures, totals rows, page title) | 32 | 32 | 0 | — | negative format "(-$3.13)" (D3, HELD) |
| Technician Utilization — internal, daily rows, lost labor, raw-clock recompute | 2,645 | 2,398 | 97 | 150 | Utilization % decimals (D2, HELD); SV-11688 still live |
| Technician Utilization — pooling, TA reconciliation (S1-R9), open clocks | 383 | 341 | 37 | 5 | all FAIL = SV-11688 open clocks / time-zone windows / another worker's new clock |
| Shop Efficiency — formula, = Sales invoiced hours, = billable clocked hours (4 loc × 9 ranges) | 144 | 119 | 25 | — | all explained (open clocks, rounding, API-only data); N2 Rule-24 |
| Timesheet Activities — every row and footer, 4 loc × 9 ranges, completeness vs raw clocks | 119,979 | 119,892 | 51 | 36 | all FAIL = SV-10698 / SV-10701 (filed) or deleted-WO clocks (O6) |
| Payroll Timesheet (hidden page) — screen + API, 4 loc × 5 presets (+ custom → 400 validation) | 20 | 4 | 16 | — | O9 → PO question WQ-6 |

Raw rows: `results-wip-internal.json`, `results-wip-oracle.json`, `results-wip-filters.json`, `results-tu.json`, `results-tu2.json`, `results-ta.json`, `results-se.json` (the two biggest are compacted: PASS rows counted, every non-PASS row kept; full files in `/tmp/cln/w1/full/`). Seeded ids: `results-seeded-records.json`. Tools: `tools/`.

## Findings at a glance

| # | Finding | Verdict | File |
|---|---|---|---|
| D1 | WIP **Days Open** counts calendar dates: a work order 10 hours old shows "1 days" (spec S4-R12: elapsed ÷ 24 h, floored → "0 days"). 3,977 of 4,061 HD rows one day high at 00:45 local | **HELD for PO (WQ-1)** — ticket drafted | `defects/DEFECT-CANDIDATE-wip-days-open-counts-calendar-days.md`, `defects/TICKET-W1-D1-wip-days-open-calendar-days.wiki` |
| D2 | TU **Utilization %** shows two decimals (85.71%); spec S2-R7 one decimal (85.7%) | **HELD for PO (WQ-2)** — conflicts with SV-9059 (Done) and SV-9407 (same symptom, OBSOLETE) | `defects/DEFECT-CANDIDATE-tu-utilization-two-decimals.md`, `defects/TICKET-W1-D2-tu-utilization-two-decimals.wiki` |
| D3 | WIP negative amounts "(-$3.13)"; spec S4-R14 "-$1,234.56" | **HELD for PO (WQ-3)**, no ticket yet | `defects/DEFECT-CANDIDATE-wip-negative-amounts-in-brackets.md` |
| N1 | WIP values a line with an hourly rate AND a fixed price at hours × rate ($135 instead of $500) | **Not a defect — Rule 24** (screen makes the two exclusive; screen-made S1-38209 correct at $500) | `defects/NOT-FILED.md` |
| N2 | Shop Efficiency counts a void invoice's hours | **Not a defect — Rule 24** (only the API voids an invoice) | same |
| N3 | TU counts never-clocked-out timesheets 24 h/day | **Already reported SV-11688** — still reproduces; also at Lethbridge (Grace Smith) | same |
| N4 | TA rows ≠ footer with a clock running since an earlier day | **Already reported SV-10698** | same |
| N5 | TA DST day row 24.00 h for a 23-hour day | **Already reported SV-10701** | same |
| O1–O12 | Rounding, spec-silent cases, hidden page, labels | Observations / PO questions | same, `PO-QUESTIONS.md` |

---

## 1. Work In Progress

**Source:** WIP specification, Confluence **703660034**, **version 28**, last modified **24 Aug 2026** (Chris Ward), read live 28 Oct 2026 (`sources/WIP-703660034-read-2026-10-28.md`). Our last record said v6 (2026-07-29): **22 versions newer**. Also read: SV-9027 (Chris, 2026-08-10: Estimates are line-based), SV-9119 (Chris, 2026-08-13: completed WO → all Earned), SV-9214 (as-of control), SV-9403.

**What was checked (as of today, every tab, every row, all 4 locations + all locations; as-of 1, 7, 30 and 400 days back):**
- A1 tab label counts = rows = row count (20/20 ×) · A2 Totals row = Σ rows for all 8 money columns and Labor Delta (180/180) · A3 Earned = LE + PE, Remaining = LR + PR, Total = E + R + Adj, open status only (49,070 row checks per day) · A4 Completed tab holds no Remaining (S4-R16a/R18a) · A5 tab placement per S3-R1..R4 · A5b an Estimates second row carries no adjustments (S3-R6) · A5c an Estimates row earns nothing · A6 a work order appears only in its status tab plus Estimates · A7 the five strip figures (S5-R4..R8) — **all PASS** on every scope and day (246,643 PASS).
- As-of: today reads live; past days 1/7/30 back read the snapshot (`has_snapshot` true); 400 days back → no rows, `has_snapshot` false (S7-R8a) — PASS. The screen's message text for that case was **NOT VERIFIED**.
- Independent recompute of all 4,907 rows from `GET /api/work-orders/lines/{id}` (lines, parts, part requests, clock records) + `GET /api/work-orders/view/{id}` (WO-level adjustments): **4,296 PASS**. The 611 FAIL rows, every one classified:
  - 309 — a line with an hourly rate AND a fixed price (N1, API/E2E-created; 307 of them on the Completed tab).
  - 145 — 1–5 cent line-value rounding (O2).
  - 113 — clocked hours rounded to 0.01 h per clock before prorating, ≤ $1.00 per row (O1; 3 seconds-only clocks leave the work order on *Approved - not started*).
  - 12 — "received later" part requests (O3, WQ-4).
  - 32 — other, each inspected: 15 more clock-hour rounding on long jobs ($1.07–$4.47 over 20–70 clocked hours); 6 parts differences on lines priced with a Fixed Line Total that also carry part requests (the oracle does not model that split); 3 parts differences on work orders with part returns (S3-16743, S2-17499, S3-12856 — returned quantities are left out by the build, which is reasonable); 3 tab placements where a part received on a fixed-total line correctly moves the job to *partially completed* (oracle gap); 2 line-level fees the oracle wrongly read from the work-order summary (S2-32229, S2-32337 — build correct per S4-R30); 1 inconsistent line record (S2-33467: fixed price $0 while the line's labor reads $169.95 → WIP $0.00); 1 Estimates row whose Labor Delta counts 2 h clocked on an unapproved line (S2-17420); and **S2-37302 Parts Earned $12.00 vs $8.00 from its two visible parts — not explained (NOT VERIFIED)**.
- Filters (S7-R1/R2/R12, S5-R11, S6-R6): Advisor, Customer and both combined, all 4 tabs, 4 locations — filtered rows, totals and strip equal the subset taken from the unfiltered report; option lists equal the values present — **500/500 PASS**. **Asset filter NOT VERIFIED** (key format not tested).
- Seeded (DVI Test): **S1-38202** — approved $135 line + needs-approval $135 line + $50 fee + $20 discount → status row Adjustments $30.00, Total $165.00; Estimates row $135.00 with Adjustments $0.00 — PASS (S3-R5, S3-R6, S4-R21, S4-R29). **S1-38209** (made through the screen) — Fixed Labor $500 → Approved - not started Remaining $500.00; completed with 0 h clocked → Completed Earned $500.00, Remaining $0.00 — PASS (§3, S4-R15a). **S1-38201** (fixed price set by API with an hourly rate) → $135.00 → N1.
- Screen = server (DVI Test 20:3x UTC, Heavy Duty 20:37 UTC): tab labels and counts, all seven strip figures, every tab's Totals row equal the API — PASS. Page title "Work In Progress - Report | ShopView" — PASS (S1-R5). Tab label capitalisation differs (O10).
- **Days Open:** see D1.
- **NOT VERIFIED:** PDF/CSV exports (Story 9), column selector persistence (Story 8), the S7-R8a "nearest earlier day" indicator wording, accessibility (Story 10), nightly snapshot contents vs the live report of that day (Story 11 — no same-day live capture exists to compare).

## 2. Technician Utilization

**Source:** TU specification, Confluence **641400833**, **version 9**, last modified **13 Aug 2026**, read live 28 Oct 2026 (our record said v5). Also: SV-9447 (Chris, 2026-08-24: billable technicians only, current flag), SV-11688 + Chris Ward's ruling 2026-10-22 (open > 24 h left out; a live shift < 24 h counts), SV-9059 / SV-9407 (decimals).

**Checked (4 locations + all locations × today, yesterday, this/last week, this/last month, 15 Sep–14 Oct, 1–14 Mar 2026 DST window, this year):**
- T1 Summary = Σ rows for Total/WO/Internal seconds and Est. Lost Labor — 180/180 PASS · T2 Total = WO + Internal — 316/316 PASS · T8 **Est. Lost Labor = location default rate × internal hours** (HD $149.95, Lethbridge $159.95, QB/DVI $135.00) — 169/169 PASS · T5a non-billable staff not listed (SV-9447) — 80/80 PASS.
- T5 **WO hours recomputed from raw clock records** (`GET /api/technician-tasks/list`, LabourBilling, 48,577 records), clipped to each window and split at local midnight: 131/150 PASS when each piece is rounded to 0.01 h as the report does (both TU and Timesheet Activities round per clock — that is how they reconcile). The 19 FAIL: the SV-11688 open clocks (8), clocks on deleted work orders that the raw listing omits but TU counts (O6, 4 technicians 0.14–1.06 h this year), and 36-second rounding at piece boundaries (7).
- T3 per-day rows: sum to the technician row in 193/214 (FAIL = 0.01–0.03 h rounding, O5); ascending, inside the range 214/214 PASS; 15 day rows with 0 seconds (O4).
- R1 **S1-R9 reconciliation — TU Total = Timesheet Activities total for the same technician, range, single location, closed records: 63/80 PASS.** The 17 FAIL are all technicians with a clock open since 31 Aug (SV-11688 — TU counts 24 h/day while TA shows 0 for a past range) plus one DVI Test difference caused by another worker adding a clock between my two reads (re-read: TU 3.00 = TA 3.00).
- P1/P2 all-locations pooling and the Location label "Multiple": 138/147 and 140/147 PASS; the rest come from the all-locations window being in the active workplace's time zone (S1-R7) and from 0.00-hour rows (O4).
- **Utilization % on screen: two decimals** (D2). Est. Lost Labor format "$4,850.88" — PASS (S2-R9). Column order — PASS (S2-R1).
- **SV-11688 (open timesheets) still reproduces** on this build: Heavy Duty — Daniel Montoya, Jacqueline Calderon, Monica Brady 673.03 h each this month, 720.00 h last month; Summary this month 2,134.34 h, Utilization 35.31%; **also Lethbridge — Grace Smith 662.04 h this month** (not named in SV-11688). Not re-filed.
- **NOT VERIFIED:** exports, column selector, sort, Total Hours link, rate-change history (S2-R8a — no rate change seeded), "—" for a location with no rate (S2-E3 — every location has a rate).

## 3. Shop Efficiency (Reports > Shop Efficiency)

**Written source found:** no PRD/spec page (Confluence search: title/text "Shop Efficiency", "Shop Billing Efficiency" — none). Jira: **SV-2116** "Create 'Shop Billing Efficiency' report" (Fabian Bonjean as PO, 2023-11/2024-03): *"This report calculates the total hours clocked in a time period (on all work orders, and department jobs) and compares that against total hours invoiced for the same time period."*, billable employees only (billable at the time of clocking), *"Efficiency = Hours invoiced divided by hours clocked * 100(%)"*, *"If the work order did not get invoiced, it would not calculate them. If the lines are declined, it also does not calculate them."*; **SV-2881**: Billing Efficiency 'Total Hours Invoiced' and Sales 'Total Invoiced Hours' *"should be the same"*.

**Checked (4 locations × 9 ranges, paired reads with Sales and TU):** Difference = Invoiced − Clocked 36/36 PASS · Efficiency = Invoiced ÷ Clocked × 100 36/36 PASS (N/A when clocked 0) · Invoiced = Sales Total Invoiced Hours 29/36 (FAIL: 0.02–0.03 h rounding at HD ×3; DVI +1 h ×4 caused by S1-38195's API-added line, where Shop Efficiency is the side that matches the invoice) · Clocked = billable closed clock time: equals Timesheet Activities' closed rows for billable staff within 0.1 h on every range up to a month (PASS); differs from TU only by the open clocks (O7/SV-11688). Screen = API at HD (128.27 / 270.37 / 142.10 / 210.78%) — PASS.
- Void invoice seeded (S1-38208) → counted (N2, Rule 24).
- **NOT VERIFIED:** Heavy Duty "this year" clocked 14,994.03 h vs 15,754 h of closed billable clocks (760 h, 5%); Lethbridge last year Shop Efficiency 10,762.85 h > TU 8,709.03 h. Probably the "billable at the time of clocking" rule (SV-2116) on department clocks, but no endpoint exposes a department clock's billable flag, so this could not be proved.

## 4. Timesheet Activities (Reports > Timesheet Activities)

**Written source found:** no PRD page. Jira: **SV-2030** (rows, columns, one clock per row, midnight split, Hours 2 decimals), **SV-2662** (*"it should only show the hours for that day ... The total hours should never contain a value more than 24"*), **SV-3239** (footer = sum of all filtered results), **SV-3309 / SV-5975** (show active punches), **SV-10698** (Cody McCarthy 2026-09-30: rows and Totals always add up — filed, Blocked), **SV-11688** ruling (TA follows the open > 24 h rule).

**Checked (4 locations × 9 ranges, 23,971 rows, every row):** Total = WO + Internal per row 23,971/23,971 · a row is either a work-order or a department clock 23,966 (5 = deleted work orders, O6) · row date inside the range 23,956 (15 = rows dated 31 Aug for clocks still open — SV-10698) · hours = Clock In → Clock Out of the row, including every midnight-split piece 23,951/23,951 · no closed row above 24 h (20 open rows of 1,394 h — SV-10698) · footer = Σ rows 55/56 without open clocks (1 = DST day, SV-10701), 6/16 with open clocks (SV-10698) · every raw work-order clock in the window is listed 36/36 · footer on screen = API (HD 2,859.82 / 1,469.35 / 1,390.47) — PASS.
- **NOT VERIFIED:** export, sort, staff filter on screen, New/Edit dialogs.

## 5. Payroll Timesheet (`/reports/payroll-timesheet`, hidden from the menu)

**Written source:** none for the page (SV-2071 describes the *export* "Payroll Timesheet" under Export Reports; SV-10702 is about that export). The page renders **empty** (no table, no message) at Heavy Duty; it sends no data request on load. Its API `GET /api/reporting/payroll-time-sheet/{range}` answers **HTTP 500 for yesterday / this week / this month / last month at all 4 locations**, **400** for custom without dates, and **200 only for today** — with the payload wrapped as a serialised response object. Today's rows (QB Location): clock in/out shown as stored, Lunch "N/A", Hours whole hours (5 minutes → "0"), an open attendance shows no hours. → PO question WQ-6; no ticket (hidden page, no source).

---

## Harness lessons (for the playbook — not written there to avoid clashing with other workers)
1. **The shared quick-login session is switched by other workers.** My first WIP read shifted every western location's as-of day by +1 because another worker changed the shared session's location between my `change-location` and my read. Fixed by minting a session of my own (`/tmp/cln/w1/sess-w1.txt`, `tools/w1env.py`). Every time-zone-sensitive read in this pass after 20:00 UTC used it; the earlier shared-session WIP data was discarded (`/tmp/cln/w1/wip_shared`).
2. `GET /api/technician-tasks/list` — the only raw clock listing — gives `start_date_display` / `end_date_display` in **UTC**, whatever the session's location; it omits department clocks and clocks on deleted work orders.
3. A headless page seeded with `localStorage.location` only can show the WIP "As of" chip as a range ("10/28/2026 → 10/29/2026") when the stored user's workplace time zone differs from the session's; values are unaffected.
4. Other workers are seeding at DVI Test with Esther Howard (e.g. S1-38205 at 15:31–16:01) — pair reads.

## Seeded data (DVI Test, customer "ZZAUTOTEST WIP FX1", asset ZZ-WIP-FX1) — left in place for the tickets' evidence
S1-38201 (fixed $500 + hourly rate via API, 0.5 h clock by Esther Howard 13:52–14:22, completed) · S1-38202 (fee $50, discount $20, one approved + one needs-approval line) · S1-38208 (invoice created through the screen, then voided by an API line add; work order left "Invoiced" with no invoice) · S1-38209 (made through the screen: Fixed Labor $500, approved, completed, VIN ZZTESTVINFX200001). Ids: `results-seeded-records.json`.
