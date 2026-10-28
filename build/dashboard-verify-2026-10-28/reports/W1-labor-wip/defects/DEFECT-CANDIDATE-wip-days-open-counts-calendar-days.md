# DEFECT CANDIDATE — Work In Progress "Days Open" counts calendar dates, not whole 24-hour periods
Project: Report Suite (epic SV-8582) · Report: Work In Progress · Prepared: 2026-10-28 · Prepared by: reports-phase worker W1 (independent full pass)
TestRail case: none — independent pass, no TestRail writes (QA lead, 2026-10-28: "TestRail ... NO")

## VERDICT: HELD — passes A2 (the spec sentence is unambiguous) but fails A5/A9 refusal 3: the build's comments record a deliberate switch to calendar dates (to match the Work Orders list and the replayed past days), and no product decision either way was found. PO question WQ-1 raised. Ticket fully drafted in `TICKET-W1-D1-wip-days-open-calendar-days.wiki`.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb` (staging). Run 1 (API, 19:43 UTC 28 Oct): Staging Heavy Duty - 9919, 3,977 of 4,061 rows show one day more than elapsed÷24 h (e.g. S2-38105 created 28 Oct 2026 15:19 local, read 29 Oct 00:4x local → `1 days`). Run 2 (screen, 20:37 UTC): same report on screen, S2-38105 reads **1 days** (picture W1-WIP-1). Also seen at DVI Test (S1-38100/S1-38099 created 27 Oct 16:25–16:28, read 28 Oct before 16:25 → `1 days`) and Staging Lethbridge - 4310 (66 rows, e.g. S3-34508 created 30 Sep 21:52, read 28 Oct 14:xx → 28 instead of 27). |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ | WIP spec, Confluence 703660034, **version 28 (last modified 24 Aug 2026, Chris Ward)**, read 2026-10-28. S4-R12: *"Days Open shows the whole number of days since the work order was created — elapsed time divided by 24 hours, floored, never negative — rendered as "X days". The value is not grammatically pluralized: a same-day work order shows "0 days" and a one-day-old work order shows "1 days"."* §4: *"Days Open → Whole days since the work order was created: elapsed time divided by 24 hours, floored (never negative)."* |
| A3 | NOT an unfinished feature | ✅ | Story SV-8660 "WIP - Story 4 - Columns and Calculations" = Done; epic SV-8582 = Done (read live 2026-10-28). |
| A4 | NOT already reported (incl. CLOSED) | ✅ | `project = SV AND text ~ "\"Days Open\""` → SV-10806, SV-10593, SV-9372 (Quote Age, open), SV-9056 (default sort), SV-8987, SV-8960 (alignment, Done), SV-8823, SV-8667, SV-8504, SV-6921, SV-5988, SV-5982, SV-5911, SV-5078, SV-5070, SV-4978, SV-4086, SV-3552, SV-3410 — none about how the count is computed. `project = SV AND (summary ~ "WIP" OR summary ~ "Work In Progress") AND created >= 2026-07-01` (49 issues) — none. |
| A5 | NOT by design | ⚠️ | No written product decision found. BUT the code (`WorkInProgressAgeReference.php`, `Model.ts`) records a deliberate change to calendar dates "for SV-9403" so today's figure matches the Work Orders listing and past days step by exactly one. SV-9403 itself (read live) is about the VIN column and says nothing about Days Open. Code is never a source (Rule 57) — but it shows the team chose this on purpose, so the PO must decide. |
| A6 | NOT environment / data / role | ✅ | Three locations, Admin, existing and seeded data; reproduces whenever the current time of day is earlier than the work order's creation time of day. |
| A7 | Correct parent, proved | ✅ | S4-R12 lives in Story 4 → SV-8660. |
| A8 | Evidence complete | ✅ | Picture `pictures/W1-WIP-1-days-open-counts-calendar-days.png`; API rows in `results-wip-internal.json` (check A8, INFO); steps below. Caveat: in the captured screen the "As of" chip reads "10/28/2026 → 10/29/2026" because the headless session's stored location time zone differed from the session's (harness artefact, see RESULTS §Harness); the Days Open value itself equals the API value. |
| A9 | Adversarial self-review survived | ❌ | Refusal 3 ("works as designed") is not defeated: a written statement that the team intends calendar dates is missing, but so is any written statement that they abandoned the spec's rule — the code says they did. |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Not filed. Jira hold H1 + per-ticket permission. |

## A9 — THE SIX REFUSALS
1. "Unbuilt." → SV-8660 / SV-8582 Done.
2. "Spec changed." → v28 (24 Aug 2026) is current and still says elapsed ÷ 24 h; its change log has no Days Open entry after 2026-08-19 (which kept "the work order's clock").
3. "Works as designed." → **Not defeated** (see A5).
4. "Cannot reproduce." → Reproduced on three locations, screen + API; the condition is mechanical (time of day now < creation time of day).
5. "Duplicate." → A4.
6. "Environment / data." → Same rule on every location and seeded data.

## IF NOT ADMISSIBLE
A PO decision: "Days Open — calendar dates (as built, matches the Work Orders list) or whole 24-hour periods (spec S4-R12)?" → `../PO-QUESTIONS.md` WQ-1. If the PO keeps calendar dates, the spec sentence S4-R12 and §4 need rewording instead (no ticket).
