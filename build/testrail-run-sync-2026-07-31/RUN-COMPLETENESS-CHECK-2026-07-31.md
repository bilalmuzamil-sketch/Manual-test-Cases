# Active-run completeness check — **VERIFIED LIVE, READ-ONLY** — 2026-07-31

> # ✅ VERIFIED LIVE THIS SESSION
>
> **Live, read-only TestRail check executed 2026-07-31 at 07:24:19 UTC.** Every figure below was
> observed directly from the TestRail API this run (`get_run`, `get_tests`, `get_results_for_run`,
> `get_cases`, `get_sections`, `get_user`) — nothing is carried forward from a record, a local
> id-map, or an expectation (Standing Rule 12).
>
> **RESULT: ALL THREE RUNS ARE COMPLETE.** Runs **352 / 357 / 359** contain **110 / 165 / 474**
> tests, which is **every one of our active cases** under groups **4110 / 4254 / 4281**.
> **0 missing · 0 stale · 0 foreign cases in any run.** No fix is needed and **no write was made.**
>
> This supersedes the previous "NOT VERIFIED — credentials needed" banner. The 2026-07-30 sync log's
> smaller sizes (**94 / 165 / 465**) were indeed superseded by later 2026-07-31 pushes — now
> **confirmed by observation, not inference**.
>
> **Raw evidence (committed):** `completeness-2026-07-31/live-evidence-2026-07-31.json`
> (per-run: full `case_id` set, union payload, status breakdown; emails redacted).
> **Read-only script (committed, secret-free — reads `/tmp/testrail/creds.json`):**
> `completeness-2026-07-31/check_runs_readonly.mjs`.

---

## 1. Headline table — the answer at a glance

| Run | Project | Group | Our ACTIVE cases (live) | Tests in run (live) | **MISSING** | **STALE** | Results on record | Holds every active case? |
|---|---|---|---|---|---|---|---|---|
| **352** | Filters | 4110 | **110** | **110** | **0** | **0** | **395** | ✅ **YES** |
| **357** | Schedule | 4254 | **165** | **165** | **0** | **0** | **429** | ✅ **YES** |
| **359** | Reports Suite | 4281 | **474** (live total under group **479**, incl. 5 foreign) | **474** | **0** | **0** | **539** | ✅ **YES** |

**Three-way match confirmed for all three projects:** live active case set == run test case_id set ==
the project's `testrail-id-map.csv` rows — **set equality, not just equal counts** (0 id-map-only,
0 run-only in every project).

| Project | id-map rows | live ours | run tests | id-map-not-in-run | run-not-in-id-map | Observed C-id range in run |
|---|---|---|---|---|---|---|
| Filters | 110 | 110 | 110 | — none — | — none — | C29557 – C38911 |
| Schedule | 165 | 165 | 165 | — none — | — none — | C29925 – C38926 |
| Reports Suite | 474 | 474 | 474 | — none — | — none — | C30096 – C38925 |

The Filters coverage gap reported on 2026-07-30 **does not recur**: run 352 is at full **110/110**.

---

## 2. Per-run detail (all fields live-observed 2026-07-31 07:24 UTC)

### Run 352 — Filters (group 4110)

| Field | Live value |
|---|---|
| Name | **Filters - Ahtasham (Awaiting QA- ENV)** |
| `include_all` | **false** — run is FROZEN at its selection; future pushes will NOT auto-appear |
| `is_completed` | **false** (active), `is_archived` false |
| Author (`created_by`) | **3 = Bilal Muzamil** (us) |
| Assigned to (`assignedto_id`) | **7 = Ahtasham Amjad** |
| Tests in run | **110** |
| Run status counts | Untested 110 · Passed 0 · Failed 0 · Blocked 0 · Retest 0 |
| Our active cases under 4110 | **110** — all `created_by: 3`, **0 foreign cases** |
| **Missing (ours, not in run)** | **NONE** |
| **Stale (test whose case is deleted)** | **NONE** |
| Result records (`get_results_for_run`) | **395** → status_id **3 (Untested) ×79**, status_id **null ×316** (comment/field-only results). **No Passed/Failed/Blocked results exist.** |

### Run 357 — Schedule (group 4254)

| Field | Live value |
|---|---|
| Name | **Schedule - Ayesha (VIU Pending)** |
| `include_all` | **false** — FROZEN selection |
| `is_completed` | **false** (active), `is_archived` false |
| Author (`created_by`) | **3 = Bilal Muzamil** (us) |
| Assigned to | **5 = Ayesha Khan** |
| Tests in run | **165** |
| Run status counts | Untested 165 · Passed 0 · Failed 0 · Blocked 0 · Retest 0 |
| Our active cases under 4254 | **165** — all `created_by: 3`, **0 foreign cases** |
| **Missing** | **NONE** |
| **Stale** | **NONE** |
| Result records | **429** → status_id **3 (Untested) ×143**, status_id **null ×286**. **No Passed/Failed/Blocked results exist.** |

### Run 359 — Reports Suite (group 4281)

| Field | Live value |
|---|---|
| Name | **Reports Suite - Nebojsa/Viktoria (VIU Pending)** |
| `include_all` | **false** — FROZEN selection |
| `is_completed` | **false** (active), `is_archived` false |
| Author (`created_by`) | **3 = Bilal Muzamil** (us) |
| Assigned to | **null** (unassigned at run level) |
| Tests in run | **474** |
| Run status counts | Untested 474 · Passed 0 · Failed 0 · Blocked 0 · Retest 0 |
| Live cases under group 4281 | **479 total** = **474 ours** (`created_by: 3`) + **5 foreign** (`created_by: 1 = Vladimir Tomovic`) |
| **Missing (ours)** | **NONE** |
| **Stale** | **NONE** |
| Foreign cases in the run? | **NO — none of the 5 are in run 359.** Correct per Rule 38. |
| Result records | **539** → status_id **3 (Untested) ×458**, status_id **null ×81**. **No Passed/Failed/Blocked results exist.** |

**The 5 foreign cases — authorship determined LIVE from `created_by: 1` (Vladimir Tomovic), not from
the id-map. Do NOT count them, do NOT add them to run 359, do NOT edit them (Rule 38):**

| C-id | Link | Title (live) |
|---|---|---|
| C38919 | https://shopview.testrail.io/index.php?/cases/view/38919 | TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it |
| C38920 | https://shopview.testrail.io/index.php?/cases/view/38920 | PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row |
| C38921 | https://shopview.testrail.io/index.php?/cases/view/38921 | IV CSV export carries the As of and Locations metadata lines above the header, plus a scope-conditional Location column |
| C38922 | https://shopview.testrail.io/index.php?/cases/view/38922 | WIP CSV export gains the Locations line while its column semantics stay exactly as shipped |
| C38923 | https://shopview.testrail.io/index.php?/cases/view/38923 | SBR Summary and Expanded CSV exports carry the Location column at its designated slot |

---

## 3. MISSING and STALE lists

**MISSING (an active case of ours absent from its run):**

| Run | Missing cases |
|---|---|
| 352 Filters | **NONE — 0 of 110** |
| 357 Schedule | **NONE — 0 of 165** |
| 359 Reports Suite | **NONE — 0 of 474** |

**STALE (a test in the run whose case no longer exists in the suite):**

| Run | Stale tests |
|---|---|
| 352 Filters | **NONE** |
| 357 Schedule | **NONE** |
| 359 Reports Suite | **NONE** |

Checked against the full live suite read (project 1 / suite 1 = **4,115 cases**, **625 sections**);
every `case_id` in every run resolves to a live case.

Because there is **nothing missing and nothing stale, no `update_run` payload is staged and none is
needed.** Nothing requires authorisation to fix.

---

## 4. If a gap is EVER found later — the staged-fix procedure (unused this run)

> ## ⚠️ `update_run` **REPLACES** the run's selection.
> Sending a **partial** `case_ids` list **DELETES every omitted test AND ITS RECORDED RESULTS.**
> Always send the **FULL UNION** — `sorted(set(current_run_case_ids) | set(missing_ours))` —
> never just the missing ones.

The union payload for each run **as it stands today** is already captured in
`completeness-2026-07-31/live-evidence-2026-07-31.json` under each run's `union_case_ids`
(today it equals `run_case_ids` exactly, since nothing is missing: 110 / 165 / 474 ids).

**Snapshot → write → verify (only after the QA lead authorises the write, Rule 6):**

1. **SNAPSHOT** `get_tests/<run>` and `get_results_for_run/<run>` to a file; record test count and
   result count.
2. **WRITE** `update_run/<run>` with `{"case_ids": <FULL UNION>, "include_all": false}`.
3. **VERIFY** re-read `get_tests` — count must equal `len(union)`; re-read `get_results_for_run` —
   count must be **≥** the snapshot and every snapshotted result id must still be present.
4. **LOG** before→after counts per run in `testrail-execution-log-2026-07-31.md`.
5. **NEVER** touch runs **278 / 324 / 325** (Rule 47) and **never** add foreign cases (Rule 38).

---

## 5. Method / honesty notes

- **Read-only, verified:** the only endpoints called were `get_run`, `get_tests`,
  `get_results_for_run`, `get_cases`, `get_sections`, `get_user`. **No `update_run`, no `add_*`, no
  `delete_*`, no result write. Runs 278 / 324 / 325 were not read or touched.**
- **Authorship live, not assumed:** `created_by` was read from the live case objects and resolved to
  names via `get_user/{id}` — user **3 = Bilal Muzamil (us)**, **1 = Vladimir Tomovic**,
  **5 = Ayesha Khan**, **7 = Ahtasham Amjad**.
- **Completeness of the input set (Rule 17):** all pages fetched (limit 250 + offset loop) for
  sections, cases, tests and results; the group case set was built from the **full transitive
  descendant** section tree of each group, not just direct children.
- **Both numbers reported (Rule 38):** Reports Suite is **ours 474 / live total 479**.
- **Credentials:** supplied to `/tmp/testrail/creds.json` (`chmod 600`), `/tmp` only. Not committed,
  not echoed into any repo file; the committed script reads them from that path at runtime. The
  committed evidence JSON has emails redacted.

Ties to Standing Rules 6, 8, 12, 17, 34, 36, 38, 47.

---

## 6. OUTSTANDING — what I need from you

| # | Item | Status | What is needed |
|---|---|---|---|
| 1 | Run completeness for 352 / 357 / 359 | ✅ **CLOSED — verified live 2026-07-31 07:24 UTC, all complete at 110 / 165 / 474** | **Nothing.** No gap, so no `update_run` authorisation is required. |
| 2 | TestRail credentials | ✅ **CLOSED** — re-supplied and used read-only this session (`/tmp/testrail/creds.json`, chmod 600, uncommitted) | Nothing. Note `/tmp` is wiped per container, so they will need re-supplying next session. |
| 3 | Any TestRail **write** | ⛔ **NOT REQUESTED — none was made** | No authorisation needed today. If a future push is wanted, authorise it explicitly and the §4 union procedure applies. |
| 4 | The 5 foreign Report Suite cases C38919–C38923 (Vladimir Tomovic) | ℹ️ **Informational** | Confirm they should remain **excluded** from run 359 and from our counts (current handling, per Rule 38). No action taken. |
| 5 | Keeping runs complete going forward | ⚠️ **Standing risk** | All three runs are `include_all: false` (**frozen**). **Any future case push must be followed by an authorised union `update_run`,** or the new cases will silently not appear — exactly the 2026-07-30 Filters situation. |
