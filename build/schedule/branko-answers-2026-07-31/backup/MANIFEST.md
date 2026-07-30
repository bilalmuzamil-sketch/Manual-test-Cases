# Pre-edit backup MANIFEST - Schedule / Branko answers 2026-07-31

Generated 2026-07-30 15:03:55Z by `apply_answers.py`.

## What is backed up here

- `pre-edit-case-bodies-2026-07-31.json` - the EXACT pre-edit JSON body of every case
  this pass touches (keyed by internal ID). Restore = copy the body back over the
  matching entry in `../cases/cases-*.json`.
- `cases-*.json.pre-edit` - byte-for-byte copies of every case FILE before any edit.
  Restore = `cp backup/cases-X.json.pre-edit cases/cases-X.json`.

## Cases touched

| Internal ID | TestRail | Fields changed | Needs TestRail update_case? |
|---|---|---|---|
| SCH-EVT-08 | C30615 | expected, notes, refs, title | **YES** |
| SCH-CAP-01 | C30030 | expected, notes, refs, title | **YES** |
| SCH-CAP-02 | C30031 | notes | no (local only) |
| SCH-CAP-03 | C30032 | notes | no (local only) |
| SCH-CAP-04 | C30033 | notes | no (local only) |
| SCH-CONF-01 | C30023 | notes | no (local only) |
| SCH-MODAL-08 | C30015 | notes, refs, title | **YES** |
| SCH-REAS-01 | C30052 | notes | no (local only) |
| SCH-EVT-01 | C30016 | expected, notes, refs, steps, title | **YES** |
| SCH-REAS-03 | C30054 | expected, notes, refs, steps, title | **YES** |
| SCH-EVT-03 | C30018 | notes, preconditions | **YES** |
| SCH-PERM-02 | C30075 | expected, notes, steps | **YES** |
| SCH-PERM-04 | C30077 | expected, notes, steps | **YES** |
| SCH-REAS-06 | C38855 | notes, steps | **YES** |
| SCH-CONF-03 | C30025 | expected, notes, refs | **YES** |
| SCH-TIP-01 | C30034 | notes | no (local only) |
| SCH-VIEW-04 | C30045 | notes | no (local only) |
| SCH-SER-01 | C29987 | expected, notes, steps, title | **YES** |
| SCH-SER-02 | C29988 | expected, notes, title | **YES** |
| SCH-DAY-06 | C30006 | expected, notes | **YES** |
| SCH-EDGE-08 | C38866 | notes, refs | **YES** |
| SCH-EXP-01 | C38853 | notes | no (local only) |
| SCH-VIEW-05 | C30046 | notes | no (local only) |
| SCH-EVT-02 | C30017 | expected, notes, refs, steps, title | **YES** |

**24 cases edited** - 15 need a TestRail `update_case`, 9 are notes-only and stay LOCAL (the executor pushes only title / custom_preconds / custom_steps / custom_expected / refs).

**0 cases added · 0 cases retired · 0 cases deleted · 0 `viu_status` changes** (everything stays VIU-Pending - Schedule has no QA branch, Rule 12).

SCH-EXP-01 is a **RETIRE-CANDIDATE held for user authorization** - it is annotated only; nothing was retired or deleted.
