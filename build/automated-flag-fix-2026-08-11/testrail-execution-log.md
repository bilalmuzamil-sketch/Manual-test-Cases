# TestRail execution log

**Date:** 2026-08-11 · **Pass:** Automated-flag fix — Filters and Report Suite.

---

## THE HEADLINE: THIS PASS MADE ZERO TESTRAIL WRITES

| Operation | Count |
|---|---:|
| `update_case` | **0** |
| `add_case` | **0** |
| `delete_case` | **0** |
| section writes (`add_section` / `update_section` / `delete_section`) | **0** |
| run writes (`update_run` / `add_run` / `close_run`) | **0** |
| result writes (`add_result*`) | **0** |
| Jira calls that create anything | **0** |
| **Total writes, all systems** | **0** |

**And that is the correct outcome, not a shortfall.** The pass was provisioned to correct cases our own
`add_case` default had wrongly flagged as Automated. Live per-case history showed **there are none in
Filters or the Report Suite** — all 44 cases that read `Automated` were set that way by Vladimir
Tomovic himself, so under Rule 38 there was nothing for us to write. The reasoning and the per-case
evidence are in `CLASSIFICATION.md`.

**Nothing was written to Schedule either**, as the brief required — see `SCHEDULE-STAGED.md`.

---

## Reads performed (all `get_*`, fully paged, no sampling)

| Call | Scope | Result |
|---|---|---|
| `get_case_fields` | project 1 | `custom_atmstatus` id 17, required, `default_value "1"`, items 1–4 · `custom_automation_type` not required, default `"0"`. Raw: `evidence/case-field-atmstatus.json` |
| `get_sections/1&suite_id=1` | project 1 / suite 1 | **626** sections, fully paged |
| `get_cases/1&suite_id=1` | project 1 / suite 1 | **4,089** cases, fully paged; filtered to the three group subtrees → 781 (ours 764 + foreign 17) |
| `get_history_for_case/<id>` | **all 44** candidates | fully paged, one call per case, **no sampling** |
| `get_user/<id>` | every user id appearing in those histories | resolved rather than assumed — only user id **1, Vladimir Tomovic**, appears |
| `get_case/<id>` | 61 cases (44 candidates + 17 foreign), **twice** — before and after | see the untouched proof below |
| `get_run/352`, `get_run/359` | both active runs, **twice** | ditto |
| `get_tests/<run>`, `get_results_for_run/<run>` | both runs, **twice** | ditto |

**A note on pagination, because it is a real trap here.** The brief flagged that `trlib.getall()`
appends `?limit=` to a URL that already contains `?`, so every paginated call returns HTTP 400. It was
**fixed, not worked around by sampling**: the whole API path already sits inside `index.php?`, so every
parameter must be joined with `&`. The first run of this pass's own population script hit the bug
exactly as described —

```
RuntimeError: 400 on get_sections/1?suite_id=1&limit=250&offset=0:
  {'error': 'Invalid characters in URI: [/api/v2/get_sections/1?suite_id]'}
```

— and was corrected to `get_sections/1&suite_id=1`, after which all 626 sections and all 4,089 cases
paged in full. The client (`tools/tr.py`) also follows `_links.next` exactly as TestRail returns it.

---

## Proof that nothing was written (Standing Rule 50 — a claimed non-write needs evidence, not an assertion)

*"We didn't write to it"* is an assertion. A byte-identical snapshot is evidence. Full output:
`evidence/untouched-proof.txt`.

### The 44 candidates and the 17 foreign cases

| Check | Result |
|---|---|
| Cases compared before and after | **61** (44 candidates + 17 foreign) |
| Field comparisons | **1,830** |
| **Mismatches** | **0** |
| `updated_on` and `updated_by` included in the comparison | **yes** — and unmoved on all 61 |
| Foreign cases (Rule 38): 12 Report Suite (Vladimir Tomovic) + 5 Filters (Ahtasham Amjad) | **0 mismatches** |
| `snapshots/CASES-PRE.json` sha256 | `f61b8abc5f26c7ad2d01d4b8b58b35a255df7c5ee7ee76dbe2ba7d4726a4250a` |
| `snapshots/CASES-POST.json` sha256 | `f61b8abc5f26c7ad2d01d4b8b58b35a255df7c5ee7ee76dbe2ba7d4726a4250a` — **identical** |

### Run 352 (Filters)

| Check | Before | After |
|---|---|---|
| `include_all` | `false` | `false` — unchanged |
| Tests | 114 | 114 |
| `case_id` sets equal in **both** directions | — | **yes** |
| `test_id` sets equal in **both** directions | — | **yes** |
| Result records | **473** | **473** |
| Prior results **missing BY ID** | — | **0** |
| New results during the window | — | **0** |
| Result fields changed (including the declared `case_refs` / `case_title` echoes) | — | **0** |
| Counters | 65 P / 7 F / 0 B / 42 U | 65 P / 7 F / 0 B / 42 U |
| `run.updated_on` | `1786377268` | `1786377268` — unmoved |

### Run 359 (Report Suite)

| Check | Before | After |
|---|---|---|
| `include_all` | `false` | `false` — unchanged |
| Tests | 476 | 476 |
| `case_id` / `test_id` sets equal in **both** directions | — | **yes** |
| Result records | **535** | **535** |
| Prior results **missing BY ID** | — | **0** |
| New results during the window | — | **0** |
| Result fields changed (incl. echoes) | — | **0** |
| Counters | 6 P / 0 F / 0 B / 470 U | 6 P / 0 F / 0 B / 470 U |
| `run.updated_on` | `1785957293` | `1785957293` — unmoved |

`snapshots/RUNS-PRE.json` and `snapshots/RUNS-POST.json` are byte-identical, sha256
`415300f386f6bc70f547b86b671acc3213b73c7187f53c70a0fba354482b6ac5`.

**Note the echo fields moved zero times here.** `case_refs` and `case_title` on run results are
declared read-time echoes of the case (playbook §J) and do move when a case's `refs` or `title` is
edited — the fact that they did **not** move is a second, independent line of evidence that no case
text was touched.

---

## Standing Rule 65 — `custom_atmstatus` recorded for every case this pass touched

Rule 65 requires the execution log to record `custom_atmstatus` for **every case a pass writes**, at
write time, because the flag moves in both directions.

**This pass wrote to no case, so there is nothing to record under that heading.** The flag's value on
all 44 cases that carry `3`, together with who set it and when, is in `CLASSIFICATION.md` §3, and the
plain-words list for the QA lead to forward is `FOR-VLAD.md`.

---

## What the pass did change — and it is all code, none of it TestRail

| File | Change |
|---|---|
| `build/testing-tools/testrail_add_case.py` | NEW — canonical `add_case` payload builder; defaults `custom_atmstatus` to `1`, raises on `3` |
| `build/testing-tools/check_add_case_payloads.py` | NEW — the guard |
| `build/testing-tools/testrail-api.mjs` | additive — the JS twin |
| `build/testing-tools/README.md` | additive — the new rows and the `custom_atmstatus` section |
| `CLAUDE.md` | additive — the `add_case` bullet now points at the helper and the guard |

Details and proof: `CODE-FIX.md`.
