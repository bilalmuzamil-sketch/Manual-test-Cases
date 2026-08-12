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

---

## Status at hand-off — what is complete, and what is not

**Both sheets are COMPLETE.** Every figure in them was derived live from TestRail in this
pass; none is carried over from a document.

**Snapshot time: 2026-08-12T05:53:56Z, and the time matters today.** Another worker was
editing the same three suites while these sheets were written, and the numbers moved twice:

| | earlier in the pass | at the snapshot |
|---|---|---|
| tests that cannot be run | 91 | **88** |
| of those, already marked Passed | 16 | **13** |
| Schedule tests waiting on a second sign-in | 14 | **11** |

Three Schedule cases — C30074, C30075, C30082 — were checked and passed by that worker and
came off the skip list. **Both figures were right for their minute.** The sheets carry the
later one and say so on their face.

## The one figure that is NOT fully live-derived

The **defects** and **misleading tickets** on tabs 2 and 3 were transcribed from today's
committed pass folders, not re-observed by this pass. The build markers **were** re-read
live from each branch's `index.html`. **No Jira call was made at all**, so every ticket
status quoted on tab 3 comes from those same committed records.

## Known shortfalls, stated rather than hidden

- **Screenshots exist but are not annotated.** Standing Rule 52's evidence bar requires
  annotated images before filing. Each tab-2 row says so in its own words.
- **The duplicate search was run for one of the three defects only** (the toast/Undo one).
  The other two say so and ask the filer to run it.
- **The concurrent worker's own pass has no committed execution log yet**, so its per-case
  detail is not in the "What changed" wording on Vlad's Section B. The case list is still
  complete, because it was derived from live TestRail rather than from the logs.
