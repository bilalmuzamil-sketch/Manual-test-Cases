# Active-run completeness check — PREPARED, **NOT EXECUTED**

> # ⚠️ NOT VERIFIED THIS SESSION
>
> **This check was NOT RUN. No TestRail API call of any kind was made in the session that wrote
> this file — not a read, not a write.** Every figure below is a **carried-forward expectation from
> earlier records**, not a live observation. Per **Standing Rule 12**, an unrun check is
> **NOT VERIFIED** and is never presented as done.
>
> **WHY IT COULD NOT BE RUN:** this container's `/tmp` was **wiped**. The TestRail credentials used
> earlier on 2026-07-31 lived in `/tmp/tr-creds.env` and are **gone**: `TESTRAIL_USER` and
> `TESTRAIL_KEY` are **unset** and `/tmp/testrail/` **does not exist** (both confirmed this session).
> Credentials were deliberately **not** guessed, hardcoded, or worked around.
>
> **WHAT IS NEEDED TO CLOSE IT:** the QA lead re-supplies the TestRail credentials
> (`TESTRAIL_USER` / `TESTRAIL_KEY` into `/tmp/tr-creds.env`, `/tmp` only, never committed). Then run
> §4 below — it is **read-only** and needs no further authorization.

---

## 0. ⚠️ ADDENDUM — a CONCURRENT SESSION's evidence file appeared on disk mid-write

**While this file was being written, an evidence bundle produced by ANOTHER session appeared at**
`build/testrail-run-sync-2026-07-31/completeness-2026-07-31/` — `check_runs_readonly.mjs` +
`live-evidence-2026-07-31.json`, both timestamped **2026-07-31T07:24:19.837Z**, i.e. **after** this
container's `/tmp` was found wiped. That session evidently **did** hold working TestRail credentials.

**What it reports** (read from the JSON, read-only, by inspection of the file — **not** by any API
call from this session):

| Run | tests in run | ours active | group total | **missing** | foreign | results | `include_all` |
|---|---|---|---|---|---|---|---|
| **352** Filters | **110** | 110 | 110 | **0** | 0 | 395 | false |
| **357** Schedule | **165** | 165 | 165 | **0** | 0 | 429 | false |
| **359** Reports Suite | **474** | 474 | **479** | **0** | **5** | 539 | false |

That is **exactly the 110 / 165 / 474 expectation in §2, with ZERO missing cases** — and it also
reproduces the Rule-38 split for Report Suite (**ours 474 / live 479**, the 5 foreign being Vladimir
Tomovic's automation cases, correctly in no run of ours). It would, if accepted, **resolve the
§2 discrepancy** in favour of "the later 2026-07-31 pushes were all synced".

**WHY THIS FILE IS STILL LABELLED NOT VERIFIED — read this carefully (Rule 12):**

1. **This session made no TestRail call of any kind**, so this session has verified nothing. The
   table above is a **second-hand reading of another actor's artifact**, which is categorically not
   the same as an observation (Rule 12: never present derived or inherited data as our own verified
   result).
2. **The bundle's provenance is unconfirmed.** It was not committed, was not announced, and appeared
   in the working tree mid-task. It has **not** been reviewed, its script has **not** been audited by
   this session, and it is **not** part of this session's commit — untracked files belonging to
   another worker were deliberately left untouched.
3. Therefore: **treat the figures above as STRONG CORROBORATION AWAITING CONFIRMATION, not as the
   closing verification.** The QA lead / coordinator should confirm the bundle's origin and, if it is
   legitimate, have that session commit it and record the result here — at which point the
   NOT-VERIFIED banner can be lifted **with a named source and timestamp**.

**Nothing in §2–§5 has been rewritten on the strength of it**, deliberately. The honest present
status remains: *believed complete, corroborated by a concurrent session's live read, not verified by
this session.*

---

## 1. What this check is for

**Standing Rule 47** makes run completeness a **standing duty** for the three projects we are
actively working: every **ACTIVE case** in the project's suite must be present as a **test** in that
project's execution run. A run built with `include_all: false` stays **FROZEN** at its original
selection, so cases pushed after the run was created **silently do not appear** — which is exactly
how a reviewer comes to report a coverage gap that does not exist (Filters run 352, 2026-07-30).

**IN SCOPE — the three active runs only:**

| Run | Project | TestRail group | Owner shown in TestRail |
|---|---|---|---|
| **352** | Filters | 4110 | Filters - Ahtasham (Awaiting QA- ENV) |
| **357** | Schedule | 4254 | Schedule - Ayesha (VIU Pending) |
| **359** | Reports Suite | 4281 | Reports Suite - Nebojsa/Viktoria (VIU Pending) |

**OUT OF SCOPE — do not check, do not audit, do not report gaps for (Rule 47):** run **278**
(Vladimir Tomovic's Custom Permissions run — different author, different project), run **324** (Fees
& Discounts, completed), run **325** (Simple Flow, completed), and every nightly/automation run.
Their contents are **not evidence about our suite**.

---

## 2. Expected figures — and where each one comes from

| Run | Expected tests | Source of the expectation | Live-verified? |
|---|---|---|---|
| **352** Filters | **110** | `build/filters/testrail-id-map.csv` = **110** active rows (counted this session, local file) | ❌ **NOT this session** |
| **357** Schedule | **165** | `build/schedule/testrail-id-map.csv` = **165** active rows (counted this session, local file) | ❌ **NOT this session** |
| **359** Reports Suite | **474** | `build/report-suite/testrail-id-map.csv` = **474** active rows (counted this session, local file) | ❌ **NOT this session** |

The **474** figure for run 359 was reported live-verified at **474/474 tests, 539/539 results** during
the 2026-07-31 coverage-re-derivation pass (`build/OUTSTANDING-ITEMS-REGISTER.md`, and
`build/report-suite/coverage-rederivation-2026-07-31/`). **That is a record from earlier today, read
here from a file — it is not a fresh observation.**

### ⚠️ A discrepancy that must be resolved by the live check, not assumed away

The **committed sync execution log** in this same folder
(`run-sync-execution-log-2026-07-31.md`, executed against live TestRail **2026-07-30T14:20Z**)
records the post-write state as:

| Run | Tests before | Tests after | Results before/after |
|---|---|---|---|
| 352 Filters | 79 | **94** | 395 / 395 |
| 357 Schedule | 143 | **165** | 429 / 429 |
| 359 Reports Suite | 458 | **465** | 539 / 539 |

So the last **directly observed** run sizes were **94 / 165 / 465**, while the expected figures are
**110 / 165 / 474**. The gaps are **352: +16** and **359: +9**; **357 already matches at 165**.

**The most likely explanation** — consistent with the register — is that further cases were authored
and pushed **later on 2026-07-31**, after that log was written, and were synced in those later
passes (the register states run 359 was subsequently verified at 474/474, and that Filters/Schedule/
Reports Suite were "all re-measured the same day" at 110/165/474). **But this is reasoning from
records, not an observation.** The alternative — that the later pushes were **not** all synced into
runs 352 and 359 — **cannot be excluded without the live read.** Treat the two runs as
**COMPLETENESS UNCONFIRMED** until §4 is executed.

---

## 3. Guardrails that apply when the check IS run

- **§4 is 100% READ-ONLY** — `get_run`, `get_tests`, `get_results_for_run`, `get_cases`,
  `get_sections` only. It needs no authorization beyond having credentials.
- **A WRITE (`update_run`) needs the QA lead's EXPLICIT authorization** (Standing Rule 6). Finding a
  gap does **not** authorize fixing it.
- **IF A WRITE IS LATER AUTHORIZED — UNION ONLY (Rules 34/47).** `update_run` **REPLACES** the run's
  selection: a partial `case_ids` list **DELETES the omitted tests AND THEIR RECORDED RESULTS.**
  Therefore **snapshot `get_tests` + `get_results_for_run` BEFORE the write**, send
  `sorted(set(current) | set(new))`, and **verify after**: test count equals expected **and every
  prior result is still present**. Log the count before→after.
- **Never touch runs 278 / 324 / 325** (Rule 47). The executor already hard-blocks them.
- **Foreign CASES stay untouched** (Rule 38) — e.g. Vladimir's C38919–C38923 in the Report Suite
  folder are **ours-474 / live-479** and belong in **no** run of ours. Do **not** add them.
- **Report BOTH numbers** — "ours N / live total M" — so counts stay honest (Rule 38).

---

## 4. The exact procedure to run once credentials are re-supplied

```bash
# 1. Re-supply credentials into /tmp ONLY (never commit; /tmp is wiped per container).
#    Ask the QA lead for TESTRAIL_USER + TESTRAIL_KEY, then:
#       printf 'TESTRAIL_USER=...\nTESTRAIL_KEY=...\n' > /tmp/tr-creds.env
set -a && . /tmp/tr-creds.env && set +a

# 2. READ-ONLY audit: which ACTIVE cases exist in TestRail but are MISSING from each run?
cd /home/user/Manual-test-Cases
python3 build/testrail-run-sync-2026-07-31/run_sync_audit.py \
        --outdir build/testrail-run-sync-2026-07-31/completeness-<YYYY-MM-DD>
```

Then read the emitted `audit.json` and confirm, **for runs 352 / 357 / 359 ONLY**:

1. `include_all` — if `true`, new cases appear automatically and there is nothing to sync; just
   confirm the test count equals the live active case count.
2. `tests` — compare against the expected figure in §2 (**110 / 165 / 474**), and against that
   project's **live** active case count under its group (4110 / 4254 / 4281), **not** against the
   local id-map alone.
3. The **missing-case list per run** — this is the actual answer. **Empty = complete.**
4. `get_results_for_run` count per run — record it, so any later authorized write can be proven not
   to have destroyed a result.

**Record the outcome by editing this file**: replace the NOT-VERIFIED banner with the live figures,
the UTC timestamp, and the per-run missing-case lists. If a gap is found, **report it to the QA lead
and request authorization** — do not write.

---

## 5. Status line for reports until this is executed

> *Runs 352 / 357 / 359 are **believed** complete at **110 / 165 / 474** on the strength of the
> 2026-07-31 sync passes, but have **NOT been re-verified live since**; the last directly observed
> sizes were **94 / 165 / 465** (2026-07-30). TestRail credentials were wiped with `/tmp`, so no
> live check was possible. **NOT VERIFIED — credentials needed.***

Ties to Standing Rules 6, 8, 12, 17, 34, 36, 38 and 47.
