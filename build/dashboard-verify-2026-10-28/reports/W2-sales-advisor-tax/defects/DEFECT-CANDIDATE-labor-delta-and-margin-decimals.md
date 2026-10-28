# DEFECT CANDIDATE — Labor Delta (SBC, SBR) and Margin % (SBC) show two decimals where the specs say one
Project: Report Suite (epic SV-8582) · Reports: Sales By Customer, Sales By Representative · Prepared: 2026-10-28 · Prepared by: W2

## VERDICT: HELD — written sources disagree. PO question **RQ-2**.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE | ✅ | Build `v26.43.2-f8698cb`. SBC, Heavy Duty, This month, TestVT1: Labor Delta **+112.64**, Margin % **82.81%**; Totals +265.31 / 86.69% (`pictures/SBC-1-margin-percent.png`). SBR, DVI Test, This month: Labor Delta **+1.00, +0.96, 0.00, +9.96, +12.96** (`pictures/SBR-1-same-day-order.png`). |
| A2 | Expectation quoted VERBATIM | ⚠️ | SBC v22 S12-R2: *"The value on each row is hours invoiced minus hours worked, rounded to one decimal."* S7-R11: *"…to one decimal with a percent sign — for example, 64.7%."* SBR v30 S9-R2: *"The value is hours invoiced − hours worked (§3), rounded half-up to one decimal."* SV-9199 / SV-9200 (Chris Ward, 12 Aug): *"the signed one-decimal format (+2.0 / -14.0 / 0.0) … stay exactly as they are."* **Against:** SV-9068 (Done, 10 Aug) *"Inv Hours should show 2 decimals (per row and in Totals)"* and SV-9069 (Done) *"Two decimals — 89.60% …"*, both titled "SV standard is 2". |
| A3 | NOT unfinished | ✅ | Stories Done |
| A4 | NOT already reported | ❌ | SV-9068 / SV-9069 are the opposite request (Done); SV-8989 (WIP, one decimal asked, OBSOLETE) |
| A5 | NOT by design | ❌ | SV-9068/9069 made two decimals deliberately for SBC; SBR follows the same shared formatter |
| A6–A8 | | ✅ | All locations; pictures |
| A9 | Adversarial review | ❌ | Refusals 2 and 3 not defeated |
| A10 | Rule 62 | ✅ | Not filed |

SBR's Margin % is two decimals in its own spec (§3 "to two decimals") — that part is correct.
