# Handover deliverables — 12 August 2026

Two files, both for people outside this session.

## 1. `Manual-Tester-Handover_2026-08-12.xlsx` (+ `.md` twin)

For the manual QA tester, who is reading it for the first time. Four tabs:

1. **Read me first** — the one rule that matters (if a test says it cannot be run, mark it
   Blocked) and why it is not a formality.
2. **Problems found, not reported** — **three** confirmed faults with no ticket, written out
   so a tester can file them personally if they choose. Nothing has been filed: the QA lead's
   Jira creation hold is active.
3. **Old tickets that mislead** — four tickets where the ticket and the product disagree.
   Three closed but still reproducing, one open but already fixed. Suggestions only.
4. **Tests that cannot be run yet** — all **91**, with the **16** that already carry a Passed
   result marked. That is the single most actionable item in the sheet.

**Three defects, not four.** The brief anticipated four; the evidence supports three. Nothing
was padded to reach a number.

## 2. `Test-Case-Changes-for-Vlad_2026-08-12.xlsx` (+ `.md` twin)

For the automation engineer, per Standing Rule 65. Every case created, updated or deleted on
11 and 12 August — **771** in total, **0 deleted**.

- **Section A — 44** cases TestRail flags as Automated. Each was checked individually against
  `get_history_for_case`: all 44 were flagged by Vladimir Tomovic himself, never assumed.
  **7 of the 44** change what an automated check should conclude; they are banded at the top.
- **Section B — 714** other updated cases, banded per project with the 78 real changes first.
- **Section C — 13** created cases.

## How the numbers were derived

Everything was read **live from TestRail, read-only (`get_*` only)** on 12 August 2026. Zero
TestRail writes, zero Jira calls. The build markers on the three QA branches were read directly
from each branch's `index.html`.

The change list was established **two ways and reconciled**: from the committed per-operation
logs of every pass dated 11 or 12 August, and from TestRail's own `created_on` / `updated_on`.
**The two sets are equal in both directions — 771 = 771, with no member either set lacks.**

`tools/` holds the derivation scripts and their raw output, so every figure can be re-derived.
