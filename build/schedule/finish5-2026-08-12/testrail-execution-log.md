# Schedule finish5 — TestRail execution log

**Build `v3.5-65d6500`** · **2026-08-12** · executor
`build/schedule/finish5-2026-08-12/tools/write.py` · per-operation log
`evidence/testrail-oplog.json`, **flushed after each write** so a killed run is resumable from git.

## SCOPE OF WRITES

**`update_case` ONLY — 4 operations, over Schedule group 4254 alone.**

| add_case | delete_case | add/update_section | update_run | add_result | Jira create |
|---|---|---|---|---|---|
| **0** | **0** | **0** | **0** | **0** | **0** |

**`custom_atmstatus` was never sent on any payload.** It is recorded below **at write time**
(Standing Rule 65), because the flag moves in both directions and reading it afterwards can give a
different answer from the truth at the moment of the write.

## THE OPERATIONS

| # | Case | Op | HTTP | `custom_atmstatus` at write time | Fields sent | Mismatches | Verified |
|---|---|---|---|---|---|---|---|
| 1 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | update_case | 200 | 1 (Not Automated) | 3 | none | ✅ |
| 2 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | update_case | 200 | 1 (Not Automated) | 3 | none | ✅ |
| 3 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | update_case | 200 | 1 (Not Automated) | 3 | none | ✅ |
| 4 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | update_case | 200 | 1 (Not Automated) | 3 | none | ✅ |

**4 of 4 HTTP 200 and byte-verified. 0 mismatches, so the batch never had to stop.**

All three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) were sent on **every**
payload, because TestRail re-renders any text field omitted from an `update_case` through its HTML
pipeline. Every payload was **printed and read** in a dry run before `--go` was passed.

### What each write changed

- **C38875** — Rule-54 sentence 2 re-stamped, **and** the one cosmetic step-2 correction
  (`DIVERGENCES.md` §1). The expected results were not touched.
- **C38863 · C38865 · C30615** — Rule-54 sentence 2 re-stamped only.

**C29986 was a deliberate no-op**: it already carried `v3.5-65d6500` and needed no step fix, so
nothing was written to it. It **was** walked this pass.

## THE STAMP

`Last checked against build v3.5-65d6500 on 12 August 2026.`

Sentence 2 only. **Sentence 1 — which names the documents — was not touched on any case**, and the
barred *"as per the build"* form appears on none of the five (verified live after the writes).
**No build line was invented**: the executor refuses outright rather than attach a stamp to a case
with no provenance sentence, and refuses any case carrying raw markup.

## VERIFICATION, DERIVED LIVE AFTER THE WRITES

| Check | Result |
|---|---|
| Rule-54 stamps per case | **exactly 1** on all five |
| Naming the running build | **5 of 5** |
| `AUTOMATION:` markers per case | **exactly 1** on all five |
| Barred phrase *"as per the build"* | **0 of 5** |
| Raw markup | **0 of 5** |
| `refs` unchanged | **5 of 5** — byte-compared against the values read at pass start |
| `custom_atmstatus` | **1 on all five, unchanged** |

## RUN 357 — PROVEN UNTOUCHED **BY CONTENT**, NEVER BY `updated_on`

Snapshotted before the first write (`evidence/run357-PRE.json`) and re-read after the last.

| | Before | After |
|---|---|---|
| `include_all` | false | **false** |
| Tests | 176 | **176** |
| Result records | **529** | **529** |

- **Prior results missing by id: 0**
- **Results with any graded field moved: 0** (`status_id`, `test_id`, `comment`, `defects`,
  `created_by`, `created_on`, `elapsed`, `version`, `assignedto_id`)
- **New results during the write window: 0**
- **`case_id` sets equal in BOTH directions: true**

`update_run` was never called and no result was ever logged.
