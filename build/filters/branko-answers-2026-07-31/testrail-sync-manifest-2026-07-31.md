# TestRail sync MANIFEST — Filters, Branko Parts/Reports apply pass, 2026-07-31

> **STATUS: STAGED — written BEFORE the first write** (house convention: manifest first,
> execution log during). Superseded by
> `testrail-execution-log-2026-07-31.md` once executed.

| | |
|---|---|
| **Authorization** | **USER-AUTHORIZED 2026-07-31** — "execute the Branko-answers APPLY-PLAN in full, including retiring the 9 palette cases", explicitly including the TestRail ops and the run-352 write (Standing Rule 6) |
| Source of truth | `APPLY-PLAN.md` §2/§3/§4/§6 · rulings in `answers-ingested.md` · analysis in `DELTAS.md` |
| **Spec baseline (Rule 31)** | **v1.6** — Confluence page **572030978** version **12**, updated **2026-07-28** |
| Quality gate (Rule 28) | `RULE28-AUDIT-2026-07-31.md` — **PASSED** before this manifest was written (477/477 sweep assertions) |
| Scope | project **1** / suite **1** / group **4110** ONLY · run **352** ONLY |
| **Totals** | **2 `add_section` + 8 `add_case` + 2 `update_case` + 1 `move_cases_to_section` + 1 `update_run`** |
| **`delete_case`** | **0** |
| Result writes | **0** — no result is written, changed or deleted |
| Live-build check | **NOT RUN** (Rules 12/22) — every case stays `viu_status: VIU-Pending` |

**Pre-write state, read live 2026-07-31 (read-only `get_sections` / `get_case` / `get_run` /
`get_tests` / `get_results_for_run`):**

- Group **4110 "Filters - (VIU Pending)"** has **15** child sections: 4111–4124 + 5410.
  **Neither "Parts Page Filters" nor "Reports Page Filters" exists** → both must be created.
- **C38882** (FLT-RPTS-23) currently sits in section **4117 "Active Filter Chips and Clear
  Filters"** — a temporary home, because "Reports Page Filters" did not exist. Its live `refs`
  still cite **spec v1.3** (superseded three times) = the Rule-20 traceability defect this pass
  fixes.
- **C38880** (FLT-PERS-05) sits in section **4121 "Persistence"** (correct — no move). Its live
  `refs` also still cite **spec v1.3**.
- **Live tester-facing bodies of C38882 and C38880 were diffed against local: title,
  preconditions, steps and expected all MATCH exactly.** Both updates are therefore **`refs`-only**
  — zero tester-facing change, zero re-read risk.
- Field ids confirmed live: **Functional = `type_id` 6**, **High = `priority_id` 3**,
  **Medium = `priority_id` 2**.

---

## 1. `add_section` — 2 (parent 4110)

| # | Name | Parent | Will hold |
|---|---|---|---|
| S1 | **Parts Page Filters** | 4110 | FLT-PARTS-01, -09, -11, -12, **-13 (new)** |
| S2 | **Reports Page Filters** | 4110 | FLT-RPTS-01, -21, -22 + **C38882 moved in** |

Verify: re-GET each new section id; assert `parent_id == 4110` and the exact name.

## 2. `add_case` — 8

Every add carries **`custom_atmstatus: 3` + `custom_automation_type: 0`** (mandatory for
`add_case` in this TestRail instance), plus title / `custom_preconds` / `custom_steps` /
`custom_expected` / `refs` / `type_id` / `priority_id`. All 8 are **non-API** (`api_related:
false`) so none routes to an "API —" section (Standing Rule 4 satisfied).

| # | Internal ID | Section | Type / Priority | Note |
|---|---|---|---|---|
| A1 | **FLT-PARTS-01** | S1 Parts Page Filters | Functional / Medium | MG14 merge survivor; Vendors hedge retained |
| A2 | **FLT-PARTS-09** | S1 | Functional / Medium | Core / Non Core |
| A3 | **FLT-PARTS-11** | S1 | Functional / High | apply behaviour |
| A4 | **FLT-PARTS-12** | S1 | Functional / Medium | multi-select + both clear actions |
| A5 | **FLT-PARTS-13** | S1 | Functional / High | **NEW-1** — the Q3 parity/regression guard |
| A6 | **FLT-RPTS-01** | S2 Reports Page Filters | Functional / Medium | MG15 merge survivor |
| A7 | **FLT-RPTS-21** | S2 | Functional / High | apply behaviour |
| A8 | **FLT-RPTS-22** | S2 | Functional / Medium | the six new filter types |

Verify per add: HTTP 200, then **re-GET** and assert title / preconds / steps / expected / refs /
section_id / `custom_atmstatus` / `custom_automation_type` all **MATCH** local.

**⚠️ `refs` are written COMMA-FREE.** TestRail normalizes `refs` as a comma-separated reference
list and **strips the space after every comma** — the 2026-07-31 push produced 6 false re-GET
MISMATCHes from exactly this (visible right now in C38882's live refs: `"no presets,no default"`).
All 10 refs strings in this pass use semicolons and `+`, no commas.

## 3. `update_case` — 2 (both `refs`-only)

| # | Case | Internal ID | Section | Change | Required? |
|---|---|---|---|---|---|
| U1 | **[C38882](https://shopview.testrail.io/index.php?/cases/view/38882)** | FLT-RPTS-23 | 4117 → S2 | `refs`: drop *"spec v1.3 Parts + Reports sections (export awaited)"* → live v1.6 §4 "New date-range filter type" + §2 Reports Filters + Branko Q5 exception 2 + tech plan D19 | **REQUIRED** (Rule 20 — a live case citing a superseded spec version) |
| U2 | **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880)** | FLT-PERS-05 | 4121 (no move) | `refs`: drop *"spec v1.3 Key Decisions (export awaited)"* → live v1.6 `S10-R4` + §4 "Parts and Reports selections are scoped to their view/tab and persist there" + Branko Q5 exception 1 + tech plan D20 | optional in the plan — **authorized and in scope, so it is executed** |

**No tester-facing field is sent** for either. Verify: HTTP 200 + re-GET `refs` byte-identical to
local **and** title/preconds/steps/expected **unchanged** from the pre-write snapshot.

## 4. `move_cases_to_section` — 1

`update_case` does **not** move a case between sections. Use:

```
POST index.php?/api/v2/move_cases_to_section/{S2_id}   body {"suite_id": 1, "case_ids": [38882]}
```

Verify: re-GET C38882 → `section_id == S2_id`. This closes the follow-up logged in
`../PROJECT-STATE.md` 2026-07-30 ("FLT-RPTS-23 section move").

## 5. `update_run` — 1 (Standing Rule 34) — MANDATORY LAST STEP

Run **352 "Filters - Ahtasham (Awaiting QA- ENV)"**, `include_all` **false** → it is FROZEN at its
case selection and the 8 new cases would be **invisible to the tester** without this sync. That is
the exact failure that created Rule 34 (a junior QA reported "no case exists" for coverage that
existed).

| Step | Assertion |
|---|---|
| `get_run/352` | snapshot; confirm `include_all == false`, `is_completed == false` |
| `get_tests/352` BEFORE | snapshot; derive the current case_id list — **expected ~102, re-read live, do not trust this number** |
| `get_results_for_run/352` BEFORE | snapshot — **expected 395 result records** |
| union | `sorted(set(current) | set(new_8))`; assert `set(current) ⊆ union`; assert `len(union) == len(current) + 8` |
| `update_run/352` | send the **FULL UNION** as `case_ids`; change nothing else |
| verify | test count `== len(union)` (expect **102 → 110**); every prior case_id present; all 8 new present; no extras; **results count UNCHANGED at 395** |

**⚠️ NEVER send a partial `case_ids` list — `update_run` REPLACES the selection, so a partial list
DELETES the omitted tests AND THEIR 395 RECORDED RESULTS.** Abort and report on any failed
assertion.

**Run 352 belongs to another tester (Ahtesham).** The user's authorization for this pass covers the
run write explicitly. **No other run is touched.**

## 6. Explicitly NOT in this manifest

| Not done | Why |
|---|---|
| **0 `delete_case`** | The 9 `FLT-SRCH` retirements are **local-only** — every C-id was asserted BLANK, so there is nothing in TestRail to delete |
| **The 13 `FLT-PSRCH` cases** (C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38898, C38899, C38900, C38901, C38902, C38903) | Different component = Filters' own Story 13, **in scope**. Flag F2: a literal reading of one clause of Branko's answer would descope them; the correct response is question **NEW-Q1**, not an edit. **Untouched, verified by C-id.** |
| Stale-`refs` fixes on **FLT-STAT-07 = C38877** and **FLT-API-06 = C38895** | Real pre-existing Rule-20 defects found by the Stage-2b sweep, but **outside this pass's authorized change list** — recommended for the next authorized push |
| The 37 over-long titles | Standing trim queue; separate authorized pass |
| Any result write, any other run, any other group, any section rename/delete | Out of scope |
| Any `build/global-search/**` write (recording Branko's ownership ruling) | Cross-project write — needs its own authorization |
