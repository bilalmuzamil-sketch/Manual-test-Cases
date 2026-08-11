# STAGED — run 357 union sync, 174 → 176 — 2026-08-11

# 🛑 NOT EXECUTED. NOT AUTHORISED. NOTHING WAS WRITTEN TO RUN 357.

**Run 357 "Schedule - Ayesha (VIU Pending)" belongs to Ayesha Khan and holds 458 graded result
records.** The QA lead has authorised creating and updating **test cases**; he has **not** authorised
a run write, and Standing Rule 6 makes a run write his call. This file is the exact call a later
authorised pass would send, with the snapshots already taken.

**Proven untouched by this pass:** `include_all` still **false**, **174** tests, **458** results all
present **by id**, **0** graded-field changes, **0** new results, counters unchanged at 25 Passed /
0 Failed / 1 Blocked / 148 Untested. Evidence in `testrail-execution-log.md` and
`evidence/RUN357-{PRE,POST}-ids.json`.

---

## Why the sync is needed at all

`get_run/357` → **`include_all: false`**. A fixed-selection run is **FROZEN at the selection it was
created with** and **never picks up a new case by itself**. So **C43588 and C43589 exist in the suite
but sit OUTSIDE the run the tester actually executes** — which is precisely how a reviewer on the
Filters project came to report coverage gaps that did not exist (Standing Rules 34 / 47).

Until this is run, the honest position is: **the suite is 176, the run is 174, and two new cases are
not executable from it.**

---

## 🛑 THE ONE THING THAT MUST NOT GO WRONG

**`update_run` REPLACES the run's case selection. It does not add to it.**

**A partial `case_ids` list DELETES every omitted test AND ITS RECORDED RESULTS — here that would
destroy up to 458 graded results belonging to another tester.** There is no undo.

**So: send the FULL UNION of 176, never the 2 new ids, never a subset.**

---

## The call

```
POST /index.php?/api/v2/update_run/357
{
  "case_ids": [ ...the full 176-id union below... ],
  "include_all": false
}
```

`include_all` stays **false** — flipping it to `true` would silently pull in every case in suite 1
across all projects, which is a far larger change than the one being asked for.

### The union — 176 ids, machine-readable copy at `evidence/RUN357-union.json`

**Derived as `sorted(set(current 174) | {43588, 43589})`, and checked: the difference against the
current selection is exactly `{43588, 43589}` and nothing else.**

```
29925, 29927, 29928, 29929, 29930, 29931, 29932, 29933, 29934, 29935, 29936, 29937
29939, 29940, 29941, 29942, 29943, 29944, 29945, 29946, 29947, 29948, 29950, 29951
29952, 29953, 29954, 29955, 29956, 29957, 29958, 29959, 29960, 29961, 29962, 29963
29964, 29965, 29967, 29969, 29970, 29971, 29972, 29973, 29974, 29975, 29978, 29979
29980, 29981, 29982, 29983, 29984, 29985, 29986, 29987, 29988, 29989, 29990, 29991
29992, 29995, 29996, 29997, 29998, 29999, 30001, 30003, 30004, 30005, 30006, 30008
30009, 30010, 30011, 30012, 30013, 30014, 30015, 30016, 30017, 30018, 30020, 30021
30022, 30023, 30024, 30025, 30027, 30028, 30029, 30030, 30031, 30032, 30033, 30034
30035, 30036, 30037, 30038, 30039, 30040, 30041, 30042, 30043, 30044, 30045, 30046
30047, 30050, 30051, 30052, 30054, 30057, 30058, 30059, 30060, 30061, 30062, 30064
30065, 30066, 30068, 30070, 30071, 30072, 30073, 30074, 30075, 30076, 30077, 30078
30079, 30080, 30081, 30082, 30083, 30084, 30086, 30087, 30088, 30089, 30090, 30614
30615, 38847, 38848, 38849, 38850, 38851, 38855, 38863, 38864, 38865, 38866, 38867
38868, 38869, 38870, 38871, 38872, 38873, 38874, 38875, 38926, 43554, 43555, 43556
43582, 43583, 43584, 43585, 43586, 43587, 43588, 43589
```

---

## Snapshots already taken (do not re-derive them — verify against these)

| File | Contents |
|---|---|
| `evidence/RUN357-run-PRE.json` | the run record before this pass |
| `evidence/RUN357-run-POST.json` | the run record after this pass — byte-identical on every counter |
| `evidence/RUN357-PRE-ids.json` | 174 `case_id`s, 174 `test_id`s, **458 `result_id`s** |
| `evidence/RUN357-POST-ids.json` | the same, after — set-equal both ways |
| `evidence/RUN357-union.json` | the current 174, the 2 new, and the 176-id union |

**Re-snapshot at execution time anyway** (`get_tests/357` + `get_results_for_run/357`, both **paged**
— an unpaged call returns 250 and truncates silently). These snapshots are ~a few hours old by the
time anyone reads this and Ayesha may have graded more; **the union must be recomputed from the
selection as it stands then**, not from this file's list.

---

## Verify AFTER the write — all six, and none of them by count alone

1. `get_run/357` → **176** tests, `include_all` still **false**.
2. `case_id` set **equal in BOTH directions** to the 176-id union.
3. All **174 prior `test_id`s still present BY ID** — 0 lost, 0 rebound to a different case.
4. **Every prior result record present BY ID** (458 as at this pass, or whatever the fresh snapshot
   holds) — **by id, never by count**: a matching total hides a swap.
5. **0 changes on the graded fields** (`status_id`, `comment`, `defects`, `elapsed`, `version`,
   `assignedto_id`, `created_by`, `created_on`, `test_id`, `id`).
6. **Expect `case_title` and `case_refs` to move on some records and do NOT read it as damage** —
   they are TestRail's declared read-time echoes of the case's current title and references
   (playbook DECLARED NORMALISATIONS #2 / #2b / #2c). **This pass already saw 3 such records move,
   all traced to C29998, the one case whose `refs` were edited.** A raw whole-record compare will
   otherwise report a false "results changed" and stop a clean batch.

**On any failure of 1–5: STOP and report. Do not retry a run write.**

---

## Tooling

Use the proven executor with its **SCOPE cut to run 357 alone** — `build/schedule/tools/run_sync_357_only.py`
is the precedent (2026-08-05, 165 → 168, `update_run` HTTP 200, all 429 results present by id).
**Do not use the 2026-07-31 multi-run script**: runs 352 and 359 belong to other testers who are
live on them, and a script that can reach them can damage them.

Read-only checker first: `build/testrail-run-sync-2026-07-31/run_sync_audit.py`.

---

## What to say to the QA lead

> Two new Schedule test cases exist — C43588 and C43589 — but Ayesha's Schedule test run does not
> include them, because that run was built from a fixed list of cases and does not pick up new ones
> on its own. Adding them is a one-call change and the call is written out and ready. It needs your
> go-ahead because the run is Ayesha's and it holds her recorded results. Nothing has been changed
> in it.
