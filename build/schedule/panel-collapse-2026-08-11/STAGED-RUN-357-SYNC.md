# STAGED — run 357 union sync. **NOT EXECUTED.** — 2026-08-11

> **Nothing in this file has been run.** It is a plan, computed and verifiable, waiting on the QA
> lead's go-ahead. **Run 357 belongs to Ayesha Khan**, and a run write needs explicit authorisation
> (Standing Rules 6 / 34 / 47).

## Why the run needs syncing at all

`get_run/357` returns **`include_all: false`**. A fixed-selection run **never** picks up newly added
cases, so the six cases pushed today are **not** in it and will not appear for the tester. This is the
exact condition that made a reviewer see false coverage gaps on Filters run 352 on 2026-07-31.

## ⚠️ The danger this plan is shaped to avoid

**`update_run` REPLACES the selection.** A partial `case_ids` list **deletes the omitted tests AND
their recorded results** — here that would destroy **458 result records**, including
Ayesha's 25 Passed and 1 Blocked. **The list below is the FULL UNION, never a delta.**

## The numbers

| | |
|---|---|
| Case ids currently in run 357 | **168** |
| New case ids to add | **6** (C43582–C43587) |
| Overlap between the two | **0** |
| **UNION to send** | **174** |
| Result records that must survive | **458**, all present by id afterwards |
| Counters that must be unchanged | **25 Passed · 0 Failed · 1 Blocked · 142 Untested** → untested becomes **148** |

**Pre-write snapshots already taken and held**, so the plan is verifiable rather than trusted:
`get_tests/357` and `get_results_for_run/357` as at 2026-08-11 03:2xZ.

## The exact call

```
POST update_run/357
{ "case_ids": [ <the 174 ids below, in full> ] }
```

### The full union — 174 case ids

```
  29925, 29927, 29928, 29929, 29930, 29931, 29932, 29933, 29934, 29935, 29936, 29937, 29939, 29940, 29941, 29942, 29943, 29944, 29945, 29946,
  29947, 29948, 29950, 29951, 29952, 29953, 29954, 29955, 29956, 29957, 29958, 29959, 29960, 29961, 29962, 29963, 29964, 29965, 29967, 29969,
  29970, 29971, 29972, 29973, 29974, 29975, 29978, 29979, 29980, 29981, 29982, 29983, 29984, 29985, 29986, 29987, 29988, 29989, 29990, 29991,
  29992, 29995, 29996, 29997, 29998, 29999, 30001, 30003, 30004, 30005, 30006, 30008, 30009, 30010, 30011, 30012, 30013, 30014, 30015, 30016,
  30017, 30018, 30020, 30021, 30022, 30023, 30024, 30025, 30027, 30028, 30029, 30030, 30031, 30032, 30033, 30034, 30035, 30036, 30037, 30038,
  30039, 30040, 30041, 30042, 30043, 30044, 30045, 30046, 30047, 30050, 30051, 30052, 30054, 30057, 30058, 30059, 30060, 30061, 30062, 30064,
  30065, 30066, 30068, 30070, 30071, 30072, 30073, 30074, 30075, 30076, 30077, 30078, 30079, 30080, 30081, 30082, 30083, 30084, 30086, 30087,
  30088, 30089, 30090, 30614, 30615, 38847, 38848, 38849, 38850, 38851, 38855, 38863, 38864, 38865, 38866, 38867, 38868, 38869, 38870, 38871,
  38872, 38873, 38874, 38875, 38926, 43554, 43555, 43556, 43582, 43583, 43584, 43585, 43586, 43587
```

## Verification required AFTER, if it is ever run

1. `include_all` still **false**.
2. Test count **174**; `case_id` sets **equal in BOTH directions** against this union.
3. All **458** prior result records present **BY ID**, with **0 graded fields changed** —
   never by count alone.
4. All **168** prior test ids still present **by id** (0 lost, 0 rebound).
5. Only `untested_count` and `updated_on` moved on the run record.

**Use an executor scoped to run 357 alone.** The 2026-07-31 script iterates several runs; runs 352
and 359 belong to other people and other workers are live on them.
