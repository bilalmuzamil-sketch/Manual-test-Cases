# TestRail execution log — Report Suite re-check push · 2026-08-04

**Standing Rule 50 — EXHAUSTIVE then EXACT.** Every operation below is recorded with its target C-id,
its HTTP status, **and its verification result**. A log that recorded only "200 OK" would be
non-compliant, so each entry also states **how many fields were byte-compared**.

## What was written, and nothing else

| Pass | Operation | Cases | Field written | Verification |
|---|---|---:|---|---|
| 1 | `update_case` | **469** | `custom_expected` only | re-GET, **28 fields byte-compared per case** |
| 2 | `update_case` | **2** | `custom_expected` only | re-GET, **28 fields byte-compared per case** |

**No `add_case`. No `delete_case`. No `add_section`. No `update_run`. No result writes.**
Run **359** was snapshotted before the run and verified after — see below.

## The per-operation method, applied to every single case

1. **Pre-write snapshot** — the full `get_case` body of all 469, pulled read-only before any write
   (`data/live-cases-START.json`).
2. **Immediately before writing**, the case is re-GET and proven **byte-identical to that snapshot** on
   every field except `updated_on` / `updated_by` — so a case moved by somebody else under us aborts the
   batch rather than being silently overwritten. **0 cases drifted.**
3. **Write** — `update_case` carrying **only** `custom_expected`.
4. **Re-GET and compare field by field** — the intended field byte-equal to the intended value, and
   **every one of the other 27 fields byte-identical to the pre-write snapshot**. This is the half a
   `200 OK` can never tell you, and it is what proves nothing collateral moved.
5. A mismatch is treated as a **failed write**: stop the batch, dump both byte sequences, do not retry.
   **This never triggered — 0 mismatches across 471 operations.**

**Declared normalisation (the only one, per APP-ACTIONS-PLAYBOOK §J):** TestRail's `refs` field splits
on commas, trims each entry and rejoins with a bare comma, so `refs` is compared under
`','.join(p.strip() for p in s.split(','))`. **This pass wrote no `refs`**, so the guard was inert — it
is kept because an undeclared normalisation and a silent write failure are indistinguishable without it.

**Rule 38 guard, active throughout:** the executor refuses any case whose `created_by != 3` and
hard-refuses the five known foreign ids **38919, 38920, 38921, 38922, 38923**. It never fired, because
no foreign case was ever in the plan.

## Pass 1 — the Rule-54 provenance re-stamp · 469 cases

**Why the line changed as well as being re-applied.** It previously read *"…as per the build tested on
8/4/2026, …"* — but **two builds existed on 2026-08-04** (`v3.4.1-0ed4433` and `v3.4.1-3d03023`), so
the date alone could no longer say which was tested. The re-check queue had itself flagged that
ambiguity. **Standing Rule 49 obligation (3) requires the build marker to live on the case, and names
Rule 54 as the mechanism** — so the marker was *missing* against Rule 49, not added on a whim.

```
before: This is the expected behaviour as per the build tested on 8/4/2026, and as per the
        Sales By Customer report specification version 13 (S1-R1, S1-R3, S1-R4).
after : This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023),
        and as per the Sales By Customer report specification version 13 (S1-R1, S1-R3, S1-R4).
```

**The stamper is idempotent** — it *replaces* an existing `(build …)` clause and never appends a second;
proven by applying it twice to the same body and comparing (`tools/build_restamp.py` prints
`IDEMPOTENT: True`). The build marker and date are **two constants** at the top of that file.

**The three honesty variants were preserved untouched**, because they are load-bearing: **424 plain** ·
**37** that say the behaviour follows a later product decision where the specification differs ·
**8** that say the specification currently states otherwise and a product decision is awaited.

**One case carried a second, larger change in the same write** (so it was written once, not twice):
**IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)** — expected item 4
said *"the CSV's **first line** reads "As of: 2026-08-04""*, which the deploy made **false** by adding a
`"Date Range:"` line above it. Rewritten scope-conditionally so a further added line cannot break it:
*"…it is one of the short summary lines that sit above the column headings … **do not count the summary
lines - more of them may be added**."*

Per-operation records: `exec-log.jsonl` (one JSON line per case: op number, `case_id`, HTTP status,
`fieldsCompared`, `verified`).

## Pass 2 — the now-false SV-8819 warning removed · 2 cases

**PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367)** and
**PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)** each carried:

> `Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/SV-8819`

**SV-8819 is fixed on this build**, so that sentence would have told a tester to ignore behaviour that
is now correct. Removed under the QA lead's explicit instruction (*"its 'known issue / filed for a fix'
line must come off"*), and **only after both cases were proven to pass** —
`evidence/sv8819-case-verification.json`. A **fresh** pre-write snapshot was taken for these two, because
pass 1 had already written them.

Per-operation records: `exec-log-sv8819.jsonl`.

## Run 359 — proven untouched, by ID not by count

| Check | Before | After |
|---|---|---|
| `include_all` | `false` | `false` |
| Tests in the run | **469** | **469** |
| Result records | **529** | **529** — **every one verified present BY ID** |
| Run case_ids vs our 469 cases | **set-equal both directions** | **set-equal both directions** |

**No `update_run` was sent.** None was needed: no case was added or removed, and the run's selection
already contained exactly our 469. Sending a partial `case_ids` list would have **deleted** the omitted
tests and their results — which is why the snapshot was taken first regardless
(`data/run359-START.json`, `run359-tests-START.json`, `run359-results-START.json`).

## The five foreign cases — proven untouched

`data/foreign-START.json` holds the byte-level snapshot of Vladimir Tomovic's **C38919, C38920, C38921,
C38922, C38923**, taken before any write and re-compared after, **including `updated_on` and
`updated_by`**. *"We didn't write to them"* is an assertion; a byte-identical snapshot with unmoved
timestamps is evidence.

## Reconciliation after the push

| Source | Count | Set equality |
|---|---:|---|
| Live TestRail, ours (`created_by == 3`) under group 4281 | **469** | — |
| Live TestRail, total under group 4281 | **474** | 469 ours + 5 foreign |
| Local active case source | **469** | ✅ set-equal to the id-map, both directions |
| `testrail-id-map.csv` | **469** | ✅ its C-ids set-equal to live-ours, both directions |
| `testrail-import/report-suite-v1-testrail-import.csv` | **469** | ✅ titles set-equal to local, both directions |

**Hygiene:** import header SHA-256 **byte-identical to all three peer projects** (Filters, Simple Flow,
Fees & Discounts) · **0** duplicate titles · **0** occurrences of "VIU" · **0** feature-flag words ·
**0** internal-ID leaks · **0** titles over 80 characters (longest exactly 80) · **0** blank C-ids in the
id-map.

**One trap hit and recovered, recorded so the next pass expects it:** running `gen_import.py` **blanked
all 469 C-ids in `testrail-id-map.csv`** — the documented gotcha. Restored from git and re-verified at
**0 blanks**. The regenerated import's **only** content difference from the committed version is the
C30590 sentence, confirmed by diff.

**DO-NOT-AUTOMATE warnings:** counted **live on the build after the push** — **47**, exactly the expected
number. A regeneration silently removed them once before; they are all present.


---

## FINAL RESULT — verified after the run, exhaustively

`data/verify-after.json`, produced by `tools/verify_after.py` (read-only).

| Check | Result |
|---|---|
| Operations run | **471** — 469 re-stamps + 2 line removals |
| HTTP 200 | **471 / 471** |
| Byte-verified | **471 / 471**, **28 fields compared each**, **0 mismatches** |
| Cases carrying the new build stamp | **469 / 469** |
| Cases missing it | **0** |
| Cases with a **doubled** `(build …)` clause | **0** — the stamper is idempotent |
| **Collateral field changes across all 469** | **0** |
| DO-NOT-AUTOMATE warnings present | **47** (expected 47) |
| Cases still citing **SV-8819** | **0** (expected 0 — removed) |
| Cases still citing **SV-8818** | **10** (expected 10 — still open) |
| Cases still citing **SV-8820** | **4** (expected 4 — still open) |
| Foreign cases byte-identical **incl. `updated_on` / `updated_by`** | **True**, 0 diffs |
| Live under group 4281 | **474** = **ours 469** + **5 foreign** |

### Run 359 — before and after

| | Before | After |
|---|---|---|
| `include_all` | `false` | `false` |
| Tests | 469 | **469** |
| Result records | 529 | **529** |
| Every prior result present **BY ID** | — | **True**, 0 missing |
| case_ids set-equal to our 469, **both directions** | True | **True** |

### Build marker — read three times

| Phase | App version | `Last-Modified` | `ETag` |
|---|---|---|---|
| Start | `v3.4.1-3d03023` | `Tue, 04 Aug 2026 10:41:58 GMT` | `9875201c58ba78d9851c37f7039c16e1` |
| Mid-run | `v3.4.1-3d03023` | same | same |
| End | `v3.4.1-3d03023` | same | same |

**The build did not move during the run.** Had it moved, that would itself have been a finding.

### Reconciliation, after the push

**Four counts all 469** — live-ours / local active / id-map / import — **set-equal in both directions**.
Import header SHA-256 `a82ca60c36074512…` — **identical to Filters, Simple Flow and Fees & Discounts**.
0 duplicate titles · 0 "VIU" words · 0 feature-flag words · 0 internal-ID leaks · 0 titles over 80
(longest exactly 80) · 0 blank C-ids. **0 secrets in any tracked file** (checked with `grep -F` on every
live cookie value, the session token, and the TestRail password).
