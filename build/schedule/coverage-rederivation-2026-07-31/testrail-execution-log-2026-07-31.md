# Schedule coverage re-derivation — TestRail EXECUTION LOG (2026-07-31)

**Manifest:** `testrail-sync-manifest-2026-07-31.md` (header = EXECUTED) ·
**Executor:** `exec_sync_coverage_2026-07-31.py` (`--dry` then `--exec`) ·
**Machine log:** `testrail-op-log-2026-07-31.json`

**3 operations planned · 3 executed · 3 verified · 0 failures.**
**0 delete_case · 0 delete_section · 0 add_section · 0 result writes · no run other than 357.**

## Per-operation log

| # | Op | Case | HTTP | Verify | Detail |
|---|---|---|---|---|---|
| 1 | **add_case** → section **4279** "Permissions" | **SCH-PERM-13 = C38926** | 200 | **re-GET MATCH** (title · preconds · steps · expected · refs · `custom_atmstatus`=3 · `custom_automation_type`=0 · priority) | section verified == 4279 (asserted inside the group-4254 subtree before writing) |
| 2 | **update_case** — **PARTIAL** payload | **SCH-DND-07 = C29961** | 200 | **re-GET MATCH** on all 3 fields sent | fields sent: `custom_steps` (193→439 chars) · `custom_expected` (266→561) · `refs` (57→93). **`title` NOT sent** and asserted unchanged afterwards. Live body was re-read first and confirmed **plain text** (C29961 is not one of the 16 HTML-reformatted cases), so no one's markup was reverted. |
| 3 | **update_run** — Rule-34 union | run **357** "Schedule - Ayesha (VIU Pending)" | 200 | **verified** | `include_all` = **false** (fixed selection → the Rule-34 gotcha applies). Union written: **164 → 165** case_ids. |

## Rule-34 run-357 sync — before → after

| | Before | After | Check |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| Tests in run | **164** | **165** | = 164 + 1 ✓ |
| All 164 prior case_ids still present | — | **YES** | subset assertion passed **before** the write and re-verified after ✓ |
| New case C38926 present | no | **YES** | ✓ |
| **Results in run** | **429** (143 status 3 + 286 status-less) | **429** | **UNCHANGED** ✓ |

Guards asserted **before** the write: `set(current) ⊆ set(new_selection)` and
`len(new_selection) == len(current) + 1`. Pre-write snapshots of the run's tests **and** results
are in `pre-push-snapshot/` (`run357-tests-pre-push-2026-07-31.json`,
`run357-results-pre-push-2026-07-31.json`), so a killed run could have been verified against live
and resumed.

## One aborted-and-resumed attempt (recorded, per the no-work-loss rule)

The first `--exec` run **created C38926 correctly** and then **aborted on its own verifier**: the
verify helper collapsed a numeric `0` to `""` (`(after.get(k) or "")`), so
`custom_automation_type: 0` compared unequal to itself. **No bad data was written** — the created
case was already correct (atm 3 / auto 0 / section 4279). The helper was fixed to compare numeric
fields as numbers, a `RESUME_CID` path was added so the executor **verifies** an already-created
case instead of adding a duplicate, and the run was resumed from Phase 1. **Exactly one case was
created — C38926.** Live count under group 4254 confirms 165 (no duplicate).

## Post-write equality (all four, verified live)

| Measure | Value |
|---|---|
| Local **ACTIVE** cases | **165** |
| **LIVE** cases under group **4254** | **165** |
| `testrail-id-map.csv` rows | **165** (0 blank C-ids; the 165 C-ids are exactly the live set — 0 missing, 0 extra) |
| `testrail-import/schedule-v1-testrail-import.csv` data rows | **165** |

**All four equal.** Import hygiene: header sha1 `43b2804f…` **byte-identical to all five peer
imports**, 0 duplicate titles, 0 titles over 80 chars, 0 VIU words, 0 feature-flag words,
4 API cases all in **"API — Schedule"**, **0** API content outside an API section (Rule 4).
