# Invoice UI Refresh — Release readiness for 8 September 2026

**Measured live 7 September 2026.** Build under test: staging `v26.35.9-9812433`.
TestRail counted live from group 6559 (17 sections, paged). Jira counted live by JQL.

## 1 · Verdict — AMBER, not green

Every case in the suite was executed today and the suite itself is in good shape.
The release risk is **not** in the test coverage; it is in the defect backlog that is
still open against the epic's stories.

| Gate | State | Evidence |
|---|---|---|
| All 120 cases executed | **YES** | `RESULTS.json`, 110 Passed / 6 Failed / 4 Blocked |
| No customer-facing money error open | **NO** | SV-9773 — printed Line total is less than what is charged |
| Fixes verified on the build | **NO** | 12 Story Defects sit in Code Review; none observed on `v26.35.9-9812433` |
| Shared run R417 carries the evidence | **YES** | 120 of 120 tests scored on 2026-09-07 — 110 Passed · 6 Failed · 4 Blocked, 0 untested |
| Spec-vs-build questions closed | **PARTLY** | the held candidate is now SV-9812; the S8-R9 "Remaining Balance" finding has no open ticket by the QA lead's decision |

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
- **SV-9812** (Open, Story Defect under SV-9143, raised 7 September on the QA lead's go-ahead) — a
  specification wording correction rather than a build fault: the Asset Section rule assumes a
  separate VIN and Serial, and the product has one combined field. Not a release blocker; it makes
  one clause unscoreable until the wording is fixed.

## 3 · What is safe

- **110 of 120 cases pass on the build as it stands**, across all 16 populated sections.
- The **customer portal paid-banner feature works** — verified live in the portal today on
  six seeded payment states (partial, full, batch of two, single-then-batch, batch with a
  late fee, mixed shop-cash + portal payment). Only clause 4 of C44952 fails.
- **SV-9599 has shipped**: C44919 now passes, and the ticket is OBSOLETE. Its stale
  `EXPECT FAIL` marker was cleared today.
- **The suite is tester-ready**: 116 of 120 cases carry `AUTOMATION: READY`, the three remaining
  HOLDs are genuine, and no case points a tester at a closed ticket.

## 4 · TestRail state

| Figure | Live value |
|---|---|
| Cases in group 6559 | **120** (89 created by us, 30 by Mudassir Qamar, 1 by Vladimir Tomovic) |
| Flagged Automated (`custom_atmstatus = 3`) | 6 — hands-off without the QA lead (Rule 71) |
| `custom_automation_type` set | 120 of 120 (106 Functional · 7 E2E · 7 Unit) — none left at None |
| `AUTOMATION:` marker present | 119 of 120 (C45275, Vladimir's, has none) |
| Marker breakdown after today's correction | **116 READY · 3 HOLD · 1 none** |
| Run R417 | **120 tests, 0 untested** — 110 Passed · 6 Failed · 4 Blocked, all written 2026-09-07 |

### Markers corrected 2026-09-07 (QA lead's go-ahead)

All eight were re-read from the served page afterwards: every one renders in the
`markdown fr-view` container with no literal tags, and no title was altered.

| Case | Marker before | Marker now |
|---|---|---|
| C44937, C44938, C44939, C44942 | `Not available on Build to test Yet - Last checked 8/31/2026` | `AUTOMATION: READY` — all four executed and Passed today |
| C44951, C45175 | `HOLD - customer portal only exists on staging` | `AUTOMATION: READY` — executed in the portal today |
| C44952 | `HOLD - customer portal only exists on staging` | `AUTOMATION: READY` — executed in the portal today (Failed clause 4). Its outcome text no longer cites the closed SV-9803 |
| C44919 | `READY - EXPECT FAIL (SV-9599)` | `AUTOMATION: READY` — SV-9599 is OBSOLETE and the case Passes. **Flagged Automated; changed on the QA lead's explicit Rule-71 permission, so Vlad must be told (Rule 65)** |

The three HOLDs that remain are correct and were left alone: C44913 and C44916 (held for the PO
answer on how a tester obtains an Approval Code) and C45185 (a server error with no ticket).

**No case in the suite now references a closed ticket** — checked across preconditions, steps and
expected results for SV-9599, SV-9774, SV-9777, SV-9797, SV-9799, SV-9800, SV-9802, SV-9803,
SV-9804 and SV-9805.

## 5 · SV-9803 / SV-9804 / SV-9805 — closed deliberately

These three Story Defects were filed at 12:29–12:30 on 7 September to replace the wrongly-typed
Tasks SV-9797 / SV-9799 / SV-9800, and were transitioned to OBSOLETE at 13:07:23 CDT the same day
with no comment. This session did not obsolete them, so it was queried.

**The QA lead confirmed on 2026-09-07 that this was deliberate.** The three findings are therefore
closed and are NOT release blockers:

* the paid banner's missing "Remaining Balance" row (S8-R9)
* a shop logo cannot be removed, so the no-logo masthead rule (S1-R2) cannot be tested
* the masthead identity fields are all mandatory, so the hide-when-empty rule (S1-N1) cannot be tested

The cases that carry these findings (C44952 Failed, C44902 and C44907 Blocked) keep their verdicts
and now say plainly that there is no open ticket and that none is to be raised without him.

## 6 · Results written to R417

The QA lead authorised writing **all 120 results** into shared run **R417** on 2026-09-07,
including the Failed and Blocked ones, expressly lifting the usual Passed-only limit. Done the
same day.

* The run was **union-synced** first (Rule 34: existing tests UNION the suite, never a partial
  replacement, so no test or result could be deleted). R417 went 119 → 120 tests.
* All **120 results written**: 110 Passed · 6 Failed · 4 Blocked · **0 untested**. Every comment
  carries the build marker, the observed evidence, the clauses not observed, and — on every Failed
  and Blocked case — a plain-language "What needs to be done" a non-technical tester can act on.
* Script: `build/invoice-ui-refresh/execution-2026-09-07/push_results_to_R417.py`.

### The formatting trap this pass discovered

The first push used plain newlines. TestRail wraps a submitted result comment in **one outer
`<p>`**, so every paragraph break collapsed and the tester read a **wall of text** with the
"What needs to be done" sentence buried mid-paragraph. Verified on the served page:
`<p>=1, <br>=0`.

Probed and corrected the same day: **block `<p>` tags DO render in a result comment and do NOT
show literally**, unlike a case field written through the API. The 120 were re-pushed as block
paragraphs and re-read from the served page: `<p>=4, <br>=0`, correct paragraphs, no literal tags.
`<br>` was never emitted — it is origin-dependent (playbook §J).

Because TestRail results are **append-only** (there is no `update_result`), each test now carries
two result rows for 7 September: the first wall-of-text write and the readable re-write. The
**latest** row is the one TestRail shows first and counts, so the run reads correctly. One extra
probe row exists on C45275 from the formatting test; it is superseded by the final write.
