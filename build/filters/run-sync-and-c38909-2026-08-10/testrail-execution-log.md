# TestRail execution log — Filters, 2026-08-10

Two authorised jobs. **Two writes in total**, both verified. No result was logged anywhere, no case
was added or deleted, no section was touched, and no Jira ticket was created (Rule 62).

Verification standard: **Standing Rule 50 — exhaustive, then exact.** Every write re-read and
compared field by field against the intended payload, with every field not intended to change proven
byte-identical to its pre-write snapshot. **"HTTP 200" alone is not recorded as a verification.**

---

## Operation 1 — `update_run/352` (Job 1, run sync)

| | |
|---|---|
| **Operation** | `POST update_run/352` with `{"include_all": false, "case_ids": [ …114 ids… ]}` |
| **Target** | Run **352** — *"Filters - Ahtasham (Awaiting QA- ENV)"* |
| **Executor** | `tools/run_sync_352_2026_08_10.py` — a copy of `build/testrail-run-sync-2026-08-05/tools/run_sync_2026_08_05.py` with `SCOPE` narrowed to run 352 alone. The 2026-07-31 executor was **not** used. |
| **Payload shape** | the **FULL UNION** `sorted(set(current) | set(ours))` = 114 ids. Script asserts `current ⊆ union` and aborts otherwise. **No partial list was ever constructed.** |
| **HTTP status** | **200** |
| **Test count** | **110 → 114** |
| **Verification** | run record: 35 fields compared, only `untested_count` + `updated_on` moved (derived counters) · `case_id` set equal **both directions** (got−want empty, want−got empty) · 110 prior tests present **by id**, 0 lost, 0 rebound · **473 of 473 prior results present BY ID, 0 missing** · **0 graded-field changes**, 0 records differing on **any** field · declared echoes `case_title` / `case_refs` **0 moved** · **0 new result records** |
| **Independent re-check** | all 473 re-compared from the snapshot files outside the executor. **Ahtasham Amjad's 78 graded results (65 Passed / 13 Failed) byte-identical, 0 missing.** |
| **Result** | **VERIFIED OK** |

Cases added to the run: **C43560, C43561, C43562, C43563**. Foreign cases **C43576–C43580**
(created by user 7) were **excluded from the union and left untouched** (Rule 38); none was in the
run beforehand, so nothing of anyone else's was dropped.

Snapshots: `snapshots/run-352-before.json` (committed in `ba8449b2`, **before** the write) and
`snapshots/run-352-after.json`. Machine verdict: `verification.json`. Plan: `sync-plan.json`.

---

## Operation 2 — `update_case/38909` (Job 2, scope repair)

| | |
|---|---|
| **Operation** | `POST update_case/38909` |
| **Target** | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) `FLT-RPTS-01`, section 5412 |
| **Executor** | `tools/repair_c38909.py` |
| **Fields written** | `title`, `refs`, `custom_preconds`, `custom_steps`, `custom_expected` — **all three text fields sent explicitly**, so none was re-rendered by TestRail's HTML pipeline |
| **Pre-send shape check** | one provenance line · one automation marker · marker is the last non-empty line · blank line immediately before it · no raw markup (`<ol` `<li` `<p>` `<br` `<hr` `<strong` `</`) in any text field · title 59 ≤ 80 · every `refs` comma-entry ≤ 248 (232, one entry) · the build sentence present **verbatim** — **ALL PASS, checked before anything was sent** |
| **HTTP status** | **200** |
| **Verification** | **30 fields compared.** 5 intended fields stored **byte-for-byte as sent** (`refs` under the declared comma normalisation `','.join(p.strip() …)`). **23 fields proven byte-identical** to the pre-write snapshot. `updated_on` / `updated_by` excluded by design. **0 collateral changes.** |
| **Result** | **VERIFIED** |

Snapshots: `snapshots/C38909-before.json`, `snapshots/C38909-after.json`.

### Post-edit re-check of run 352

C38909 **is** in run 352, and its **title changed**, so the declared `case_title` read-time echo was
specifically looked for:

- tests **114**, results **473**
- prior results missing by id: **0** · graded/other field changes: **0**
- **declared echoes moved: none** — `case_title` did not fire on any of the 473 records
- new results: **0** · tests lost by id: **0** · case_id sets equal **both directions**

---

## What was NOT done

| | |
|---|---|
| `add_case` | none |
| `delete_case` | none — irreversible, and nothing earned it |
| section operations | none |
| **results logged** | **none, anywhere.** The sync adds tests; it never grades them. |
| Jira | **no ticket created** (Rule 62). Four items are written up for permission in `C38909-REPAIR.md` §7. |
| build access | **none.** No Filters QA sign-in was supplied; `quick-login` and `switch-user` were **not called**, so the shared token was not rotated. |
| build sentence on C38909 | **not re-stamped** — nothing was re-observed, so re-stamping would assert a check we did not make (Rule 12) |
| runs 357 / 359 | **not read and not written.** They are absent from the scoped executor's `SCOPE`, so it cannot reach them. |
| other authors' cases | **untouched** (Rule 38) |

## Sources checked before writing (Standing Rules 31 / 59)

| Source | Identifier | Version / last updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 19**, last modified **2026-08-06** | 15:58Z, **re-read 16:0xZ immediately before the write** | **CURRENT** — unchanged between the two reads. Body still reads *"Version: 1.6"*; the Confluence version number was used (Rule 31(a) trap) |
| Engineering handover | app-wide filter redesign, branch `SV-8785-app-wide-filter-redesign` | read 2026-08-10 | 15:56Z | **CURRENT** — the scoping source for this repair |
| Epic | **SV-8785** | not re-enumerated this pass — no epic-level claim is made | — | not required for either job |
| Branko's answers | `build/filters/branko-answers-2026-08-04/answers-ingested.md` | 2026-08-04 | 16:0xZ | **CURRENT**, verified present in git at HEAD |
| Build | `sv8785.qa.shopview.com` | last recorded **`v3.4.2-280ca5a`** (2026-08-06) | — | **NOT OBSERVED — no sign-in supplied.** Neither job needs it; the sync is TestRail and the repair is document-sourced |
