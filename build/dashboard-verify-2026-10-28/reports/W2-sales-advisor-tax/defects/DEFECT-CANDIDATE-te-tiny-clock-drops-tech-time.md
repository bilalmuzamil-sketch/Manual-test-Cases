# DEFECT CANDIDATE — Technician Efficiency gives 0 tech hours to a line whose clocks total under 36 seconds
Project: Reports · Technician Efficiency (Invoiced and Completed tabs) · Prepared: 2026-10-28 · Prepared by: W2
TestRail case: none — no TestRail writes

## VERDICT: HELD — fails A2/A5: the stories say tech time is shared in proportion to clocked time, but the Completed-tab story also says to keep the Invoiced tab's existing calculation, and the 0.01-hour cut-off is part of that existing calculation; no document mentions the cut-off either way. PO question **RQ-6**. No ticket text yet beyond this file; it is a one-paragraph change once the PO answers.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. (1) Screen 2026-10-28 21:01 UTC: Staging Lethbridge - 4310, Technician Efficiency, Invoiced, Date: Last quarter, Joseph Nelson opened → line "4. - Replace cabin air filter" on S3-17383: Clocked Hrs 0.01, **Invoiced Tech Hrs 0**, Efficiency 0% (`pictures/TE-1-tiny-clock-line.png`). The line's tech time is 30 minutes and he is the only technician who clocked it (30 seconds). (2) Server rows, every range: every line whose clocks add up to less than 0.01 h gets 0 tech hours on both tabs (counts in `../RESULTS.md`, check "Tech Hrs = the technician's share"). Another example: S3-15255 "Recommend Axle 3 right tires", Grace Smith, 12 seconds clocked, 30 minutes tech time → 0. |
| A2 | Expectation quoted VERBATIM | ⚠️ | SV-5450 (Completed tab, Done): *"Completed Tech Time Hours are allocated proportionally based on each technician's share of total clocked hours"* and *"Each technician receives a proportional share of the Completed Tech Time Hours for that labor line"* — **but also** *"This calculation must follow the existing behavior used in the Technician Efficiency (Invoiced) report. No changes to the calculation logic are included in this scope."* SV-2115 (Invoiced tab) gives no allocation formula. |
| A3 | NOT unfinished | ✅ | SV-2115, SV-5450 Done |
| A4 | NOT already reported | ✅ | JQL live 2026-10-28: SV-7265 (OBSOLETE, "incorrect when technician has not clocked onto a line") is a different case; SV-5956 (rounding of Hours Profit, Done) different; nothing about tiny clocks |
| A5 | NOT by design | ❓ | The cut-off is deliberate in the code (it avoids dividing by almost nothing); whether the line's tech time should then be lost is not written anywhere |
| A6 | NOT environment | ✅ | Lethbridge real data, Admin, both tabs |
| A7 | Parent | ✅ | SV-2115 (Invoiced) / SV-5450 (Completed) |
| A8 | Evidence | ✅ | annotated picture, server counts |
| A9 | Adversarial review | ❌ | Refusal 3 not defeated |
| A10 | Rule 62 | ✅ | Not filed |

## A9 — THE SIX REFUSALS
1. "Unbuilt." → Both tabs Done.
2. "Spec changed." → No later source.
3. "Works as designed." → **Not defeated** — SV-5450 freezes the existing calculation, and the existing calculation contains the cut-off.
4. "Cannot reproduce." → Screen + every range.
5. "Duplicate." → None.
6. "Environment." → Real location data.

## IF NOT ADMISSIBLE
PO decision RQ-6. Impact if the PO wants the share credited: the technician's Tech Hrs and the Totals rise by the lost tech time; the line's Efficiency would need its own display rule (it would be thousands of %).
