# TestRail EXECUTION LOG — Schedule / Branko answers 2026-07-31

Executor: `build/schedule/exec_sync_answers_2026-07-31.py` (+ one targeted re-push, below).
Manifest: `testrail-sync-manifest-2026-07-31.md` (header = EXECUTED).
Pre-write `get_case` snapshots: `pre-push-snapshot/` (15 + 1 re-push = 16 files).

## Result

| | |
|---|---|
| `update_case` | **15 authorized + 1 repair re-push = 16 writes** |
| HTTP | **all 200** |
| re-GET field verify | **all MATCH** |
| `add_case` / `add_section` / `delete_case` / `update_run` / result writes | **0 / 0 / 0 / 0 / 0** |
| Live case count under group 4254 | **165** == the 165-row `testrail-id-map.csv` |
| Run 357 | **verified read-only** — 165 tests, 165 distinct case ids, **429 result records (unchanged)**, run case-set **EQUAL both ways** to the live group-4254 set (0 in-run-not-live, 0 live-not-in-run) |
| Any other run | **not read, not written** |

The executor refuses a no-op: for each case it diffs the generated payload against the live
body first and aborts if nothing would change. All 15 had real changes.

## Per-operation detail

| # | Internal ID | C-id | Fields actually changed | HTTP | re-GET |
|---|---|---|---|---|---|
| 1 | SCH-EVT-08 | C30615 | title, custom_expected, refs | 200 | MATCH |
| 2 | SCH-CAP-01 | C30030 | title, custom_preconds, custom_steps, custom_expected, refs | 200 | MATCH |
| 3 | SCH-MODAL-08 | C30015 | title, refs | 200 | MATCH |
| 4 | SCH-EVT-01 | C30016 | title, custom_steps, custom_expected, refs | 200 | MATCH |
| 5 | SCH-EVT-02 | C30017 | title, custom_steps, custom_expected, refs | 200 | MATCH |
| 6 | SCH-REAS-03 | C30054 | title, custom_steps, custom_expected, refs | 200 | MATCH |
| 7 | SCH-EVT-03 | C30018 | custom_preconds | 200 | MATCH |
| 8 | SCH-PERM-02 | C30075 | custom_steps, custom_expected | 200 | MATCH |
| 9 | SCH-PERM-04 | C30077 | custom_steps, custom_expected | 200 | MATCH |
| 10 | SCH-REAS-06 | C38855 | custom_preconds, custom_steps | 200 | MATCH |
| 11 | SCH-CONF-03 | C30025 | custom_expected, refs | 200 | MATCH |
| 12 | SCH-SER-01 | C29987 | title, custom_preconds, custom_steps, custom_expected | 200 | MATCH |
| 13 | SCH-SER-02 | C29988 | title, custom_expected | 200 | MATCH |
| 14 | SCH-DAY-06 | C30006 | custom_expected | 200 | MATCH |
| 15 | SCH-EDGE-08 | C38866 | refs | 200 | MATCH |
| 16 | SCH-REAS-06 (repair) | C38855 | custom_preconds | 200 | MATCH |

## Two disclosures (things that changed beyond the planned edit)

### 1. Two cases were stored in TestRail as HTML lists and are now plain numbered lines

`SCH-CAP-01 (C30030)` and `SCH-SER-01 (C29987)` had their Preconditions and Steps stored as
`<ol><li>…</li></ol>` HTML — a leftover from the original import. Every other case in the suite
uses the house format (`1. …` plain numbered lines). Because the push writes the whole body, both
were normalised to the house format. **The wording is unchanged, item for item** — only the markup
differs, and the result is now consistent with the other 163 cases. Before/after text for both is
preserved in the run record (`/tmp/sched_answers_sync_result.json` at execution time) and the
pre-write snapshots in `pre-push-snapshot/`.

### 2. A bare internal-ID cross-reference produced an empty `()` — caught and repaired

`SCH-REAS-06 (C38855)` precondition 2 read *"…shows 'Create Event' and 'New Work Order'
**(SCH-REAS-03)**."*. `clean()` strips internal case IDs on the way to TestRail (correct — no
internal IDs in tester-facing wording, Rule 9) but only removes the `(see SCH-…)` form, so a **bare**
`(SCH-…)` left a dangling `()` in the pushed text. Spotted in the post-write diff and repaired the
same run: the precondition now reads *"The cell menu already shows 'Create Event' and 'New Work
Order'."* → 16th write, HTTP 200 + re-GET MATCH.

**Latent, same pattern, NOT touched (out of this pass's authorized scope):** `SCH-HRS-04`
precondition 1 reads *"The shop has business hours set (SCH-HRS-01/02)."* — the `/02` tail
survives the strip, so the pushed text carries a stray `(/02)`. Flagged as a follow-up; fixing it
needs its own authorized write. Worth hardening `clean()` in `gen_import.py` to drop the whole
parenthetical rather than just the ID.

## What was deliberately NOT written

- **9 notes-only edits** — `notes` and `viu_status` never reach TestRail, so no write was needed:
  SCH-CAP-02 (C30031), SCH-CAP-03 (C30032), SCH-CAP-04 (C30033), SCH-CONF-01 (C30023),
  SCH-REAS-01 (C30052), SCH-TIP-01 (C30034), SCH-VIEW-04 (C30045), SCH-VIEW-05 (C30046),
  SCH-EXP-01 (C38853).
- **The one retire — SCH-EXP-01 (C38853) Week Export — is HELD** for explicit user authorization.
  Nothing was deleted. See the manifest for the three linked operations retiring it would need.
- **No `update_run`.** `add_case` count is 0, so run 357 had nothing to gain; it was verified
  read-only instead (Rule 34).

## Post-push reconciliation

- `testrail-id-map.csv` regenerated then **C-ids re-merged 165/165, 0 blanks** (the known
  `gen_import.py` gotcha — it blanks the C-id column on every rerun). Internal-ID set verified
  identical to the pre-regeneration copy. `refs` column verified to mirror the local case bodies
  1:1.
- `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` regenerated over **165 rows**.
- Hygiene: header **byte-identical** to all four prior project imports (md5 `cccad4693ccc` on all
  five) · **0** VIU words · **0** feature-flag words · no duplicate titles · no duplicate internal
  ids · 4 API cases in the "API — Schedule" section (Rule 4) · no rows missing
  Preconditions/Steps/Expected · no C-id column.
- Live spot-check of 3 pushed cases (C30615, C30054, C29988) read back from TestRail and confirmed
  against the local bodies.

## Honesty (Rule 12)

Every case remains **VIU-Pending**. Nothing in this pass was observed on a running build — Schedule
still has no QA branch (OQ-3). A PO answer tells us what the build *should* do; it is not evidence
of what it *does*.
