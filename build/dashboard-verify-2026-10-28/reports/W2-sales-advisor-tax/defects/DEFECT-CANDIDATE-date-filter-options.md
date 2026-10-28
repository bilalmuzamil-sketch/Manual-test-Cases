# DEFECT CANDIDATE — Sales By Customer / Sales By Representative date options differ from their specs
Project: Report Suite (epic SV-8582) · Prepared: 2026-10-28 · Prepared by: W2

## VERDICT: HELD — both reports use the suite-wide filter bar; which list governs is a PO call. PO question **SQ-7**. Every date window the options produce is correct (checked below), so no figure is wrong.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced | ✅ | Screen probe 2026-10-28 (Heavy Duty, session time zone set): both reports offer *This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 12 months, Custom*. Each option requested the right local window (e.g. This week 2026-10-25 → 10-29 Karachi, weeks from Sunday; Last 12 months 2025-11-01 → 2026-10-29). |
| A2 | Expectation quoted VERBATIM | ⚠️ | SBC v22 S2-R2: *"The picker offers nine options, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. … There is no Today, no Yesterday, and no option labeled "Custom"."* SBR v30 S2-R2: *"The user can select any standard preset (Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom)."* The two specs disagree with each other and with the build. |
| A3 | NOT unfinished | ✅ | Stories Done |
| A4 | NOT already reported | ✅ | none found |
| A5 | NOT by design | ❓ | Both screens use the shared filter bar (SV-8985 migrated all reports to it) |
| A9 | Adversarial review | ❌ | Not defeated |
| A10 | Rule 62 | ✅ | Not filed |

Harness note: a first probe without the browser's location time zone set showed UTC windows; a real session stores the location's time zone, and with it set every window was correct. That was a test-harness artefact, not a finding.
