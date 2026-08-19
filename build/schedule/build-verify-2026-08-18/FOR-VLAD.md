# AUTOMATED CASES CHANGED — FOR VLAD — Schedule build-verify (2026-08-18)

> Standing Rules 65 / 71. Every case TestRail flags **Automated** (`custom_atmstatus = 3`) that this
> effort changes is listed here — C-id + link, what changed in one plain phrase, and whether it changes
> what an automated check should conclude. **Say "none" where none; never omit the section.** The
> durable cross-project hand-off list is
> `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

## The 5 Automated Schedule cases in scope (all flagged by Vladimir Tomovic, id 1)

Per `get_history_for_case` (read 2026-08-18) these five carry `custom_atmstatus = 3` set by **user 1
(Vladimir Tomovic)** — his automation contract. They are **HELD** on documents-only work and edited
only **coupled with build-verification** + **QA-lead ask-first** (Rule 71 refinement, skill §6.4):

| C-id | link | section |
|---|---|---|
| C43811 | https://shopview.testrail.io/index.php?/cases/view/43811 | Reassignment and Context Menu (§4275) |
| C38847 | https://shopview.testrail.io/index.php?/cases/view/38847 | Working Hours Settings (§5405) |
| C38848 | https://shopview.testrail.io/index.php?/cases/view/38848 | Working Hours Settings (§5405) |
| C38849 | https://shopview.testrail.io/index.php?/cases/view/38849 | Working Hours Settings (§5405) |
| C38850 | https://shopview.testrail.io/index.php?/cases/view/38850 | Working Hours Settings (§5405) |

## Changes this effort made to Automated cases

### Batch A (Navigation · Sidebar · Toolbar · Read-display, 61 cases) — **NONE**

Batch A contained **0 Automated cases** (`custom_atmstatus = 3`). `custom_atmstatus` was captured at
write time for all 61 (see `a-write-oplog.jsonl`): 40 were `1` (Not Automated), 21 were `4` (Pending),
0 were `3`. **No Automated case was changed by batch A — nothing to hand to Vlad.** The five Automated
Schedule cases (C43811, C38847–C38850) are in batches B/C.

### Batch B (Scheduling core — Drag/Scope/Spread/Shift lifecycle, 66 cases)

**One Automated case in scope — C43811 — was HELD, NOT changed (nothing to hand off yet).**

| C-id | atm (live) | Changed this pass? | Note |
|---|---|---|---|
| [C43811](https://shopview.testrail.io/index.php?/cases/view/43811) | 3 (Automated) | **NO — held** | Verified live that its feature (empty-cell menu → "Assign Work Order" → non-drag scheduling modal) is BUILT. Its stored body is **truncated/incomplete** and needs completing, but that CONTENT edit is Rule-71 ask-first + build-verify-coupled — **awaiting the QA lead's go-ahead.** When authorised, the completed case number will be recorded in `AUTOMATED-CASES-REGISTER.md`. |

The other 65 batch-B cases were `atm=1` (Not Automated) at write time (see `b-write-oplog.jsonl`,
`atm_at_write` field) — none is Vlad's, so none is a hand-off. **No Automated case was changed by
batch B.**
