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
