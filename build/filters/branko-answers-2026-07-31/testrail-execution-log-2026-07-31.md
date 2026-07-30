# TestRail execution log — Filters, Branko Parts/Reports apply pass, 2026-07-31 (**EXECUTED**)

**Authorization:** user-authorized 2026-07-31 — *"execute the Branko-answers APPLY-PLAN in full,
including retiring the 9 palette cases"*, explicitly covering the TestRail ops **and** the run-352
write (Standing Rule 6; run 352 belongs to another tester).

**Manifest (written BEFORE the first write):** `testrail-sync-manifest-2026-07-31.md` — header now
reads EXECUTED.

| | |
|---|---|
| **Spec baseline recorded on every case (Rule 31)** | **v1.6** — Confluence page **572030978**, version **12**, updated **2026-07-28** |
| Scope | project **1** / suite **1** / group **4110** only · run **352** only |
| **Totals** | **2 `add_section` + 8 `add_case` + 2 `update_case` + 1 `move_cases_to_section` + 1 `update_run`** |
| `delete_case` | **0** |
| Result writes | **0** — 395 result records before and after |
| Every op | **HTTP 200 + re-GET verified MATCH · 0 mismatches** |
| Machine logs | `oplog.json`, `new-cids.json`, `pre-push-snapshot/`, `run352/` |
| Quality gate run BEFORE the push | `RULE28-AUDIT-2026-07-31.md` — all sweep assertions PASS (475/475, 0 FAILED) |
| Live-build check | **NOT RUN** (Rules 12/22) — all cases `viu_status: VIU-Pending` |

---

## 1. `add_section` — 2, both HTTP 200 + re-GET MATCH

| Section | New id | Parent | Verified |
|---|---|---|---|
| **Parts Page Filters** | **5411** | 4110 | name + `parent_id` **MATCH** |
| **Reports Page Filters** | **5412** | 4110 | name + `parent_id` **MATCH** |

Group 4110 now has **17** child sections (was 15).

## 2. `add_case` — 8, all HTTP 200 + re-GET MATCH

Each carries `custom_atmstatus: 3` + `custom_automation_type: 0` (verified on re-GET), plus
title / `custom_preconds` / `custom_steps` / `custom_expected` / `refs` / `type_id` /
`priority_id`. All non-API (Standing Rule 4 satisfied — none belongs in an "API —" section).

| Internal ID | New case | Section | Type / Priority | What it covers |
|---|---|---|---|---|
| FLT-PARTS-01 | **[C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** | 5411 Parts Page Filters | Functional / Medium | 8-view presence walk (MG14 survivor) + "no chip is display-only" |
| FLT-PARTS-09 | **[C38905](https://shopview.testrail.io/index.php?/cases/view/38905)** | 5411 | Functional / Medium | Core / Non Core multi-select + Clear selection |
| FLT-PARTS-11 | **[C38906](https://shopview.testrail.io/index.php?/cases/view/38906)** | 5411 | Functional / High | Parts filter applies immediately (no Apply button) |
| FLT-PARTS-12 | **[C38907](https://shopview.testrail.io/index.php?/cases/view/38907)** | 5411 | Functional / Medium | multi-select + Clear selection + Clear filters |
| **FLT-PARTS-13** | **[C38908](https://shopview.testrail.io/index.php?/cases/view/38908)** | 5411 | Functional / High | **NEW-1** — no filter was lost in the redesign (Q3 parity guard) |
| FLT-RPTS-01 | **[C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** | 5412 Reports Page Filters | Functional / Medium | 23-report presence walk (MG15 survivor) |
| FLT-RPTS-21 | **[C38910](https://shopview.testrail.io/index.php?/cases/view/38910)** | 5412 | Functional / High | Reports filter applies immediately |
| FLT-RPTS-22 | **[C38911](https://shopview.testrail.io/index.php?/cases/view/38911)** | 5412 | Functional / Medium | the six new filter types |

## 3. `update_case` — 2, both HTTP 200 + re-GET MATCH, **`refs`-ONLY**

Before writing, the live tester-facing bodies were diffed against local: **title, preconditions,
steps and expected all MATCHED exactly**, so only `refs` was sent. The re-GET verification asserts
`refs` == local **and** that title / preconds / steps / expected / type / priority are
**byte-identical to the pre-write snapshot** — proving no tester-facing text moved.

| Case | Internal ID | Section | Change |
|---|---|---|---|
| **[C38882](https://shopview.testrail.io/index.php?/cases/view/38882)** | FLT-RPTS-23 | 4117 → **5412** | `refs`: *"spec v1.3 Parts + Reports sections (export awaited)"* → live **v1.6 §4 "New date-range filter type"** + §2 Reports Filters + **Branko Q5** (single range) + tech plan D19 |
| **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880)** | FLT-PERS-05 | 4121 (no move) | `refs`: *"spec v1.3 Key Decisions (export awaited)"* → live **v1.6 `S10-R4`** + §4 "Parts and Reports selections are scoped to their view/tab and persist there" + **Branko Q5 exception 1** + tech plan D20 |

Pre-write snapshots: `pre-push-snapshot/C38882.json`, `pre-push-snapshot/C38880.json`.

## 4. `move_cases_to_section` — 1, HTTP 200 + re-GET MATCH

`POST move_cases_to_section/5412  {"suite_id": 1, "case_ids": [38882]}` — **C38882 moved
4117 → 5412**, `section_id` verified on re-GET. (`update_case` cannot move a case between
sections.) This **closes the follow-up logged in `../PROJECT-STATE.md` 2026-07-30
("FLT-RPTS-23 section move")** — C38882 had been parked in "Active Filter Chips and Clear
Filters" only because "Reports Page Filters" did not exist yet.

## 5. Run 352 sync (Standing Rule 34) — 1 `update_run`, all assertions PASS

Run **352 "Filters - Ahtasham (Awaiting QA- ENV)"** — `include_all` **false** before **and**
after, `is_completed` false.

| Step | Result |
|---|---|
| `get_run/352` BEFORE | `run352/get_run-BEFORE.json` |
| `get_tests/352` BEFORE | **102 tests / 102 distinct case_ids** |
| `get_results_for_run/352` BEFORE | **395 result records** |
| Union computation | `set(current) ⊆ union` **PASS**; `len(union) == 102 + 8 == 110` **PASS** |
| `update_run/352` | **HTTP 200** — `case_ids` = the **110-id FULL UNION**; nothing else changed |
| Verify test count | **110 == expected 110** — PASS |
| Verify all 102 prior case_ids present | **PASS** (0 missing) |
| Verify all 8 new case_ids present | **PASS** |
| Verify no extra case_ids | **PASS** |
| Verify results count UNCHANGED | **395 → 395** — PASS (no result written, changed or lost) |
| Verify `include_all` still false | **PASS** |

**A partial `case_ids` list would have deleted the omitted tests AND their 395 recorded results.**
The executor sends the union only and aborts on any failed assertion. **No other run was touched.**

## 6. Live reconcile after the push

| Check | Result |
|---|---|
| Live cases under group 4110 | **110** |
| `testrail-id-map.csv` rows | **110** |
| id-map C-ids not live / live C-ids not in id-map | **0 / 0** |
| Section agreement (id-map vs live) | **110/110 MATCH** |
| Title agreement (id-map vs live) | **110/110 MATCH** |
| Command-palette-titled cases live under 4110 | **0** (the 9 were never in TestRail) |
| Run 352 tests | **110 == the live active count** |

---

## 7. Two honest deviations, both self-corrected

1. **TestRail's `refs` field has a MAX LENGTH of 250 characters** — exceeding it returns
   **HTTP 400 `{"error":"Field :refs does not match the required pattern."}`**. This was
   discovered **live, mid-run**, on the 5th `add_case` (FLT-PARTS-13 at 298 chars) after the four
   240-char Parts refs had pushed fine. **6 of the 10 refs strings were over the limit**
   (265–391 chars) and were shortened to ≤240 by `shorten_refs.py`, **keeping both Rule-20 halves
   (ticket + spec anchor) plus the Branko attribution**; every detail trimmed out of `refs` was
   moved into the case's `notes` so nothing was lost, and the strings stay comma-free. The
   executor is resumable, so the 4 already-created cases were **detected and skipped with a
   re-GET verify rather than duplicated** — no duplicate case was created and no op was
   double-applied. **This is now a durable gotcha for the playbook, alongside the older
   space-after-comma normalisation** (still visible in C38882's pre-write refs as
   `"no presets,no default"`).
2. **`tr.paged` needs `&` not `?`** for the second query parameter (`get_tests/352?` → HTTP 400
   *"Invalid characters in URI"*). Read-only call, no write attempted, fixed and re-run.

## 8. Explicitly NOT done

| Not done | Why |
|---|---|
| **0 `delete_case`** | The 9 `FLT-SRCH` retirements are **local-only** — every C-id was asserted BLANK by `apply_answers.py` before the write, so there was nothing in TestRail to delete |
| **The 13 `FLT-PSRCH` cases** — C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38898, C38899, C38900, C38901, C38902, C38903 | Filters' own **Story 13** (in-toolbar page search, 29 ratified requirements), genuinely **in scope**. Verified by C-id before and after; `cases-H-page-search-toolbar.json` shows **no diff**. Flag F2: a literal reading of one clause of Branko's answer would descope them — the correct response is question **NEW-Q1**, not an edit |
| Stale `refs` on **FLT-STAT-07 = [C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** and **FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895)** (both still cite spec v1.3) | Real pre-existing Rule-20 defects found by the Stage-2b sweep, but **outside this pass's authorized change list** — recommended for the next authorized push |
| Internal-id leak in the References of **FLT-EMPTY-02 = [C29607](https://shopview.testrail.io/index.php?/cases/view/29607)** (`"- FLT-EMPTY-03"`) | Same — pre-existing, metadata column only (not tester-facing), outside scope |
| The **37** over-length titles | Standing trim queue; separate authorized pass. **None of the 10 cases touched this pass is affected** |
| Any result write · any other run · any other group · any section rename/delete | Out of scope |
| Recording Branko's ownership ruling in `build/global-search/**` | Cross-project write — needs its own authorization |
