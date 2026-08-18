# CASES CREATED — WIP Chris Q2=B new coverage

**1 new case authored + pushed** (`add_case`, `custom_atmstatus = 1` manual, `custom_automation_type = 0`).

| Internal ID | C-id | Link | Section | Title |
|---|---|---|---|---|
| WIP-PLACE-05 | **C43979** | https://shopview.testrail.io/index.php?/cases/view/43979 | WIP — Tab Placement (4352) | A work order with lines in several states appears in each matching tab |

## What it covers (the gap Chris's Q2=B opened)
Under the line-state model there was **no case** verifying that a single work order whose lines are in
more than one state (a) appears in **every** matching tab, (b) shows **only that tab's slice** of its
money in each, and (c) that the per-tab slices are **disjoint and sum to the work order's total quoted
value**. WIP-PLACE-05 asserts exactly those three, plus that the status column still shows the work
order's one true status.

## Source (Rule 54 / 57)
- **Chris Ward's answer B, 18 August 2026** — *"we're treating WIP as a sum of lines, not work orders"*
  (`chris-answers-fetched-2026-08-18.txt`).
- **WIP spec v21 §3 Key Decisions, per SV-9027** (read live 18 August 2026): *"A work order carrying
  lines in more than one state appears in each matching tab, showing only that tab's slice of its money…
  The buckets are disjoint and always sum to the work order's total quoted value."*
- **Owning story: SV-8659 (WIP Story 3 — Tab Placement).** Epic SV-8582.
- Rule-56 divergence disclosed (differs from the older S2-R4 / Story-3 "exactly one tab by status"
  wording; newest answer wins).

## Marker
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` — build verification deferred;
never observed on any build this pass. A later build-verify sync lifts it to `READY` once runnable.

## Run
Not yet in run 359 (`include_all: false`) — staged for a union sync in `STAGED-RUN-359-SYNC.md`
(needs QA-lead authorisation).

## Byte-verify
`add_case` HTTP 200 → C43979; re-GET byte-verified: title / preconditions / steps / expected / refs
MATCH the intended payload; `custom_atmstatus = 1` confirmed live.
