# TestRail sync MANIFEST — Schedule / Branko answers 2026-07-31

**STATUS: EXECUTED** — see `testrail-execution-log-2026-07-31.md`.

> **Authorization:** user-authorized 2026-07-31 ("ingest Branko's ANSWERED Schedule question sheet
> and apply the consequences… execute update_case/add_case"). Scope limits given with the
> authorization: **project 1, Schedule group 4254 and run 357 only**; **no deletes** unless a retire
> is explicitly warranted, and if so **list it and HOLD** rather than delete.

## Exactly what is written

| Operation | Count | Detail |
|---|---|---|
| `update_case` | **15** | table below |
| `add_case` | **0** | no new cases — every ruling rewrites an existing case or clears a note |
| `add_section` | **0** | |
| `delete_case` | **0** | the single retire-candidate is **HELD** (see below) |
| `update_run` | **0** | no new cases ⇒ run 357 needs **verification only**, not a resync (Rule 34) |
| Result writes | **0** | no run results written, ever |

**Nothing outside group 4254 is touched. No other run is read or written.**

## The 15 `update_case` operations

Pre-write `get_case` snapshots for all 15 are saved to `pre-push-snapshot/` before any write.
Each write is followed by a re-`GET` and a field-by-field verify (`title`, `custom_preconds`,
`custom_steps`, `custom_expected`, `refs`). Any non-200 or any MISMATCH aborts the run.

| # | Internal ID | C-id | Fields written | Driver |
|---|---|---|---|---|
| 1 | SCH-EVT-08 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | title, expected, refs | Q1 / D1 = A (PO) + §4.11/§4.12 |
| 2 | SCH-CAP-01 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | title, expected, refs | Q1 / D1 = A + §4.12 · title trimmed 125→80 |
| 3 | SCH-MODAL-08 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | title, refs | Q2 / D4 = B (PO) + §4.9 deletion in v23 · title trimmed 82→60 |
| 4 | SCH-EVT-01 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | title, steps, expected, refs | Q4 = C (PO) + §4.10/§7 |
| 5 | SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | title, steps, expected, refs | Rule-28 Stage-2b contradiction **X6** + Q4 = C |
| 6 | SCH-REAS-03 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | title, steps, expected, refs | Q4 = C + §7 |
| 7 | SCH-EVT-03 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | preconds | Q4 = C |
| 8 | SCH-PERM-02 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | steps, expected | Q4 = C |
| 9 | SCH-PERM-04 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | steps, expected | Q4 = C + alignment with X6 |
| 10 | SCH-REAS-06 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | steps | Q4 = C |
| 11 | SCH-CONF-03 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | expected, refs | Q5 = B (PO) — prototype 8:00/5:00 removed |
| 12 | SCH-SER-01 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | title, steps, expected | Spec v22 §4.6 deletion (contradictions X1/X2) · title trimmed 137→76 |
| 13 | SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | title, expected | Spec v22 §4.6 deletion (X1) · title trimmed 117→72 |
| 14 | SCH-DAY-06 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | expected | Spec v22 §4.8 "on hover over the grid" |
| 15 | SCH-EDGE-08 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | refs | Spec v19 §11 Dark theme — refs upgraded per Rule 20 |

## Deliberately NOT written

**9 notes-only edits stay LOCAL.** The executor's `desired_body()` sends only `title`,
`custom_preconds`, `custom_steps`, `custom_expected`, `refs` — `notes` and `viu_status` are
local-only fields that never reach TestRail. So these 9 need no write and get none:
SCH-CAP-02 (C30031) · SCH-CAP-03 (C30032) · SCH-CAP-04 (C30033) · SCH-CONF-01 (C30023) ·
SCH-REAS-01 (C30052) · SCH-TIP-01 (C30034) · SCH-VIEW-04 (C30045) · SCH-VIEW-05 (C30046) ·
SCH-EXP-01 (C38853).

## ⚠️ HELD FOR SEPARATE AUTHORIZATION — one retire

**SCH-EXP-01 = [C38853](https://shopview.testrail.io/index.php?/cases/view/38853)** *"Week Export
opens a printable Department-by-Technician week grid"*.

Branko's Q3 answer, verbatim: *"No. There is nothing about this in the PRD, not in the future
requirements."* Corroborated by a full scan of live v23 (no export/print item in §6, §9 or §15) and
by the engineering tech plan's §9 requirement table. The case therefore tests something that will
not exist in V1, and the Rule-28 audit rates it **CUT**.

**It was NOT deleted.** Retiring it is three linked operations that need an explicit ruling:
1. `delete_case` C38853 (body kept locally, marked Retired — the SCH-REAS-02 precedent);
2. decide the fate of the then-empty TestRail section **5406 "Week Export and Printing"** (leave it,
   as we left empty sections before, or remove it);
3. a **run-357 resync** (Rule 34) to drop the removed test, which is a second authorized write.

Its sibling SCH-EXP-02 (C38854) was already merged away and deleted in the 2026-07-31
consolidation, so C38853 is the last survivor of that pair.

## Run 357 (Standing Rule 34)

`add_case` count is **0**, so there is nothing to add to run 357 and **no `update_run` is issued**.
The run is still **verified read-only** after the pass: test count unchanged, every prior case
still present, result records unchanged. Recorded in the execution log. No other run is touched.

## Post-push reconciliation

1. `testrail-id-map.csv` — titles + `refs` re-mirrored for the 15 updated cases (no C-id changes,
   no rows added or removed; still 165 rows / 165 C-ids / 0 blanks).
2. `testrail-import/schedule-v1-testrail-import.csv` / `.xlsx` regenerated over 165.
3. Hygiene re-verified: header byte-identical vs the four prior project imports · 0 VIU words ·
   0 feature-flag words · no duplicate titles or ids · API cases in an "API — …" section (Rule 4) ·
   no C-id column. ⚠️ `gen_import.py` blanks the id-map C-ids on every rerun — **re-merge after
   regenerating** (known Schedule gotcha).
4. `PROJECT-STATE.md` §0 block updated: spec version pulled, answers applied, tally, run-357 count,
   what is still open.
