# Invoice UI Refresh — Release readiness for 8 September 2026

**Measured live 7 September 2026.** Build under test: staging `v26.35.9-9812433`.
TestRail counted live from group 6559 (17 sections, paged). Jira counted live by JQL.

## 1 · Verdict — AMBER, not green

Every case in the suite was executed today and the suite itself is in good shape.
The release risk is **not** in the test coverage; it is in the defect backlog that is
still open against the epic's stories, and in the fact that no result has been written
into the shared run.

| Gate | State | Evidence |
|---|---|---|
| All 120 cases executed | **YES** | `RESULTS.json`, 110 Passed / 6 Failed / 4 Blocked |
| No customer-facing money error open | **NO** | SV-9773 — printed Line total is less than what is charged |
| Fixes verified on the build | **NO** | 12 Story Defects sit in Code Review; none observed on `v26.35.9-9812433` |
| Shared run R417 carries the evidence | **NO** | live: 119 untested, 0 results (held locally per standing instruction) |
| Spec-vs-build questions closed | **NO** | 3 held candidates + the S8-R9 "Remaining Balance" question |

## 2 · The blocking items

- **SV-9773** (Open, Story Defect under SV-9144) — the work-line footer ignores the line's
  own fee, so the printed **Line total is lower than the amount actually charged**. This is a
  money figure on a customer-facing document. Highest release risk of anything found today.
- **SV-9761** (Open, Story Defect under SV-9151) — staging PDFs embed DejaVu Sans, not Inter.
  Raised by another session today; corroborated independently by this pass (C44974, Failed:
  every embedded font subset on every document type is DejaVu Sans).
  **SV-9781** (Task, Board Backlog) records that the production PDF server carries the same
  old font image, so the typeface will still be wrong after release.
- **12 Story Defects in Code Review** — SV-9617, SV-9641, SV-9642, SV-9643, SV-9644, SV-9645,
  SV-9669, SV-9671, SV-9678, SV-9679, SV-9680, SV-9693. Not one of them was observed fixed on
  the build tested today. Two of them are the direct cause of Failed cases here
  (SV-9642 → C44917, SV-9680 → C44926), so at minimum those two have not shipped.

## 3 · What is safe

- **110 of 120 cases pass on the build as it stands**, across all 16 populated sections.
- The **customer portal paid-banner feature works** — verified live in the portal today on
  six seeded payment states (partial, full, batch of two, single-then-batch, batch with a
  late fee, mixed shop-cash + portal payment). Only clause 4 of C44952 fails.
- **SV-9599 has shipped**: C44919 now passes, and the ticket is OBSOLETE. Its
  `AUTOMATION: READY - EXPECT FAIL (SV-9599)` marker is now stale.

## 4 · TestRail state

| Figure | Live value |
|---|---|
| Cases in group 6559 | **120** (89 created by us, 30 by Mudassir Qamar, 1 by Vladimir Tomovic) |
| Flagged Automated (`custom_atmstatus = 3`) | 6 — hands-off without the QA lead (Rule 71) |
| `custom_automation_type` set | 120 of 120 (106 Functional · 7 E2E · 7 Unit) — none left at None |
| `AUTOMATION:` marker present | 119 of 120 (C45275, Vladimir's, has none) |
| Run R417 | **119 untested, 0 results** — nothing written |

### Markers now stale (measured today, not yet changed)

| Case | Marker on record | Why it is stale |
|---|---|---|
| C44937, C44938, C44939, C44942 | `Not available on Build to test Yet - Last checked 8/31/2026` | All four executed and Passed today |
| C44951, C44952, C45175 | `HOLD - customer portal only exists on staging` | All three executed in the portal today (C44952 Failed clause 4) |
| C44919 | `READY - EXPECT FAIL (SV-9599)` | SV-9599 is OBSOLETE and the case now Passes. **`custom_atmstatus = 3` — Rule 71, needs the QA lead** |

## 5 · Anomaly to be resolved by the QA lead

**SV-9803, SV-9804 and SV-9805 were transitioned to OBSOLETE at 13:07:23 CDT on 7 September,
with no comment.** These are the three Story Defects filed at 12:29–12:30 to replace the
wrongly-typed Tasks SV-9797 / SV-9799 / SV-9800. This session's last Jira write was at
12:39 (creating SV-9806); the changelog author is the shared `bilal.muzamil@shopview.com`
account. **This session did not obsolete them.** As things stand, all three findings are now
recorded only on OBSOLETE tickets and nobody is working them.
