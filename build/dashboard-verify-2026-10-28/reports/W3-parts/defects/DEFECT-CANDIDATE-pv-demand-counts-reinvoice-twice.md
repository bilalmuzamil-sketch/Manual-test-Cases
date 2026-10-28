# DEFECT CANDIDATE — Parts Velocity Demand counts a work order twice when its invoice is reversed and created again
Project: Report Suite (epic SV-8582) — Parts Velocity · Prepared: 2026-10-28 · Prepared by: W3 parts lane (independent reports pass)
TestRail case: none — independent pass, no TestRail writes (QA lead, 2026-10-28: "TestRail ... NO")

## VERDICT: ADMISSIBLE — every check passes. Drafted in `TICKET-D2-pv-demand-counts-reinvoice-twice.wiki`. NOT filed (Jira creation hold H1 + per-ticket permission).

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb` at start and end. Run 1 (~20:13–20:15 UTC, API-driven): stocked part ZZAUTOTEST-PV1-10282011 (10 in stock, cost $20.00) sold 2 on WO S1-38203 → Demand 1 ✓; invoice reversed → Units Sold 0.00, Demand 1 ✓ (matches the spec); invoice created again on the same work order → **Demand 2** (Units Sold 2.00 ✓); then sold 3 on a second work order S1-38204 → **Demand 3** for 2 work orders. Run 2 (~20:36–20:38 UTC, **entirely through the screen**, `tools/repro_ui_c.mjs C` then `D`): sold 1 on S1-38206 → Demand 4; Finance ⋮ → Reverse → Reverse → Create Invoice → **Demand 5** for 3 work orders. Units Sold (6.00), Revenue ($180.00) and Margin ($60.00) stay right throughout |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ | Parts Velocity Report, Confluence 620888066, **version 12** (14 Sep 2026, Chris Ward), read live 28 Oct 2026. S5-R4 table, Demand, Inventory column: *"Count of distinct in-window transactions (work orders or parts sales) with at least one invoicing event that decremented stock. A transaction counts once however many times it is invoiced, reversed or re-invoiced."* Change log 2026-08-20: *"Demand `1` is confirmed correct … QA to confirm the same part on two different work orders still shows Demand `2`."* On-screen tooltip (S3-R6): *"Each transaction counts once, no matter how many units were sold on it."* |
| A3 | NOT an unfinished feature | ✅ | SV-8645 "Velocity - Story 5 - Metric Calculations" = Done; SV-8582 = Done (read live) |
| A4 | NOT already reported (incl. CLOSED) | ✅ | `project = SV AND (text ~ "\"Parts Velocity\"" OR summary ~ "velocity") AND (text ~ "Demand")` → SV-10992, SV-10636, SV-10200, SV-9810 (core rows inflate Demand — Code Review; a different cause: core-charge rows), SV-9807, SV-9690, SV-9197, SV-8938, SV-8596 — none about reversal / re-invoice. `… AND (text ~ "\"special order\"" OR text ~ "reverse" OR text ~ "reversed" OR text ~ "re-invoice")` → no reversal ticket |
| A5 | NOT by design | ✅ | The spec's 2026-08-20 change log records the opposite decision explicitly (one transaction counts once however many times it is re-invoiced; Demand is the default sort, so double-counting pushes re-invoiced parts up) |
| A6 | NOT environment / data / role | ✅ | Fresh ZZAUTOTEST data in DVI Test (quiet location), Admin, three work orders, two routes (API and screen) |
| A7 | Correct parent, proved | ✅ | Demand's formula is S5-R4 (Story 5) → SV-8645 |
| A8 | Evidence complete | ✅ | `pictures/D2-1-parts-velocity-demand.png`, `pictures/D2-2-reverse-invoice.png`; numbered steps proven on screen; build marker; Admin; DVI Test |
| A9 | Adversarial self-review survived | ✅ | Six refusals below |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Not filed. Not yet asked. |

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. "This is unbuilt / not finished yet." → SV-8645 / SV-8582 Done.
2. "The spec changed — this is obsolete." → The re-invoice wording was added 2026-08-20 and is still in v12 (current).
3. "Works as designed." → The spec names this exact case ("however many times it is invoiced, reversed or re-invoiced") and the change log explains why it matters (default sort).
4. "Cannot reproduce." → Twice, on two work orders, once entirely through the screen.
5. "Duplicate." → SV-9810 is about core-charge rows (and is about special-order rows, not stocked parts); no reversal ticket found (A4).
6. "Environment / data / your account." → Fresh data, Admin, quiet location.

## IF NOT ADMISSIBLE
n/a — admissible.
