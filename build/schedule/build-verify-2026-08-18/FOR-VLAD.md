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

### Batch C (Events · Conflicts · Capacity · Deletion · Keyboard · Permissions · Edge · Working Hours · Cross-Module · API, 68 cases)

**Four Automated cases in scope — C38847, C38848, C38849, C38850 — were HELD, NOT changed (write
nothing).** All four are §5405 Working Hours Settings, flagged `1→3` by Vladimir Tomovic (id 1). A live
re-check confirmed these are the ONLY `atm=3` cases in batch C.

| C-id | atm (live) | Changed this pass? | Note |
|---|---|---|---|
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | 3 (Automated) | **NO — held** | Verified live: business-hours toggle (`toggle_business_hours`) reveals a per-day Mon-Sun From-To editor (`row_business_hours_<day>`, `select_business_hours_from/to_<day>_0`). Marker would lift to `READY` in a coupled ratification pass — **awaiting QA-lead go-ahead** (Rule 71). |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | 3 (Automated) | **NO — held** | Per-technician working-hours tab in Edit Staff — could not be driven this session (Staff admin table rendered no rows; staff API returns data → harness limit, not absence). Verify + lift in coupled pass. |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | 3 (Automated) | **NO — held** | No-custom-hours inherits shop hours — depends on the per-tech tab (same render limit). Verify + lift in coupled pass. |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 3 (Automated) | **NO — held** | Verified live: `button_add_business_hours_<day>` appends a second range; `button_remove_business_hours_<day>_0` removes it. Marker would lift to `READY` — awaiting go-ahead. |

The other 64 batch-C cases were `atm=1` (Not Automated) at write time (see `c-write-oplog.jsonl`) — none
is Vlad's, so none is a hand-off. **No Automated case was changed by batch C.**

---

## 2026-08-19 RE-CHECK (build v3.8-d0e135e)
No Automated (atm=3) case was changed. The 5 ours (C43811, C38847-C38850) stay HELD (Rule 71) — none
lifted to READY this pass (C43811's Assign-Work-Order menu item was re-confirmed present live; the 4
Working-Hours cases were not re-driven). The 4 foreign cases (C43569/43570/43571/43980) are untouched
(Rule 38). **No hand-off this pass.**
