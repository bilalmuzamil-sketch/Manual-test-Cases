# RECOVERY — 2026-08-11 — in-flight kill of six passes

**Read this before resuming any of the six passes.** Everything below is established from live
TestRail (`get_*` only), live GitHub, git history and the passes' own committed logs. **Zero writes
were made by this pass** — 0 TestRail writes, 0 Jira calls, 0 repository-setting changes, 0
redactions.

**Recovery run at** 2026-08-11 ~17:30–18:00Z. **Live harvest:** 4,091 cases / 626 sections
(paged), runs 357 / 352 / 359 in full.

---

## 🔴 READ FIRST — A DISCARDED FIRST ATTEMPT, AND THE HAZARD THAT CAUSED IT

**This container's checkout was 110 commits BEHIND `origin/claude/slack-session-0sxnd9`, and the
local tracking ref did not say so.** `git status` reported a clean tree and `git rev-list` reported
the branch **1 commit AHEAD**. Both were wrong: after `git fetch` the true position was **110
behind, 0 ahead**.

**What that cost, stated plainly:** the first run of this recovery concluded that **none of the six
passes' folders existed**, that **nothing had been committed**, and that **all their work was lost
with the container**. **Every one of those conclusions was false and is DISCARDED.** The folders,
the execution logs and the per-operation records were all on the remote; they were simply invisible
to a stale checkout. Items **A**, **B**, **D** and **F** were re-run from scratch on the updated
tree and only the re-run results appear below.

**Fixed by:** `git fetch origin claude/slack-session-0sxnd9` then `git merge --ff-only`. The tree was
clean, the fast-forward was accepted, **no commit of any other worker was discarded, and no force,
rebase or reset was used.** HEAD is now `5b1b573f988f267c3c2eaf0f56289033851cad6f`, matching the
confirmed remote tip.

> ### ⚠️ STANDING HAZARD — FETCH BEFORE YOU TRUST THE TREE
> **Another session is pushing to this same branch from a different container.** A worker reading a
> stale tree while writing to live TestRail is a live hazard: it can re-do work that is already done,
> "restore" text another pass deliberately changed, or regenerate deliverables from a source that is
> 110 commits out of date.
> **THE RULE: `git fetch` and `git merge --ff-only` at the START of every pass, and never trust the
> local tracking ref — or `git status`'s ahead/behind — without fetching first.** A clean tree proves
> nothing about currency.
> **This is not yet recorded in `build/APP-ACTIONS-PLAYBOOK.md` and should be** (not added here —
> that file is owned by other passes and editing it was outside this brief).

---

## A. GIT — state and orphans

| | |
|---|---|
| **HEAD** | `5b1b573f988f267c3c2eaf0f56289033851cad6f` — *"Filters: Branko question sheet regenerated, plus the Filters write plan"*, 2026-08-11 14:23:57 |
| **Branch** | `claude/slack-session-0sxnd9` (also the repo default branch) |
| **Pushed?** | **YES** — HEAD == `origin/claude/slack-session-0sxnd9`; GitHub `pushed_at` 2026-08-11T14:24:00Z |
| **Working tree** | **CLEAN** — 0 modified, 0 staged, 0 untracked |
| **Stashes** | 0 |
| **Orphan files from the killed passes** | **NONE** |

**Untracked-but-ignored:** 18 `__pycache__/` directories only, all covered by `.gitignore`. Not
orphans, nothing to recover.

**Dangling commits:** 2 exist (`c1395f23` 2026-07-31, `8f6f24ce` 2026-08-05). **Both predate today
and are unrelated to the kill** — they are not lost pass output.

**The sweeper (pass 6) did its job.** It committed and pushed **110 commits** between roughly
13:34Z and 14:23:57Z, and everything the killed passes wrote to disk is in them. **No pass output
was lost to the kill.** What was lost is only what the passes had not yet written down — identified
per pass in section B.

---

## B. TESTRAIL — what landed, per pass

**Method (Rule 12/50).** Landing was decided by **comparing live case text against each pass's own
intended payload** taken from its committed executor/plan, **not** by `updated_on`. Timestamps are
reported as corroboration only. Every Schedule case shows a today timestamp because several passes
touched the suite, so the timestamp alone cannot attribute a write to a pass.

### Live suite counts — all three reconcile with the brief

| Suite | Live total | Ours (`created_by=3`) | Foreign | Brief said | Verdict |
|---|---|---|---|---|---|
| **Schedule** (group 4254) | **176** | 176 | 0 | 176 | ✅ match |
| **Filters** (group 4110) | **119** | **114** | 5 (user 7, Ahtasham Amjad) | ours 114 / live 119 | ✅ match |
| **Report Suite** (group 4281) | **488** | **476** | **12** (user 1, Vladimir Tomovic) | 476 + "5 of Vladimir's" | ⚠️ foreign count is **12, not 5** — see §E |

**No half-finished `add_case` batch exists.** Both `add_case` operations completed and the local
id-maps agree with live: Schedule id-map **176** rows, Filters id-map **114** rows, both set-equal
to live in each direction.

---

### PASS 1 — Schedule fixes → **WRITES COMPLETE ✅ · DELIVERABLES INCOMPLETE ⚠️**

Its scope was established from its own logs, not from the brief's summary — and the brief's hint was
right to warn against assuming: the pass ran in **two phases**, an authorised staged push and a
follow-up push, and the second phase is the one that died.

**Phase 1 — `build/schedule/staged-push-2026-08-11/` (13:49:28–13:50:51Z). Fully logged, complete.**
Its log records 10 ops, all HTTP 200, 30 fields byte-compared each, 0 mismatches.

| Case | Intended | Live `updated_on` | Verdict |
|---|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | fix "steps 1 to 8" sentence | 13:49:38Z | ✅ **LANDED** |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | same | 13:49:41Z | ✅ **LANDED** |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | same | 13:49:44Z | ✅ **LANDED** |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | same | 13:49:46Z | ✅ **LANDED** |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | same | 13:49:50Z | ✅ **LANDED** |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | same | 13:49:52Z | ✅ **LANDED** |
| [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | update | 13:49:55Z | ✅ **LANDED** |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | update (rewritten again in phase 2) | 14:13:08Z | ✅ **LANDED** |
| **C43588** *(new)* | `add_case` — "Dark mode is chosen from the user menu…" | created 2026-08-11 | ✅ **CREATED** |
| **C43589** *(new)* | `add_case` — "In dark mode pop-up windows still look raised…" | created 2026-08-11 | ✅ **CREATED** |

**Phase 2 — `build/schedule/followup-push-2026-08-11/` (14:13Z). Executed, but only its executor was
committed — no findings, no changes-made, no execution log.** Intent read from
`tools/exec_followup.py`; both ops verified landed **by content**:

| Case | Intended (verbatim from the executor) | Live content check | Verdict |
|---|---|---|---|
| [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | I1 — **remove** the unsourced multi-status assertion (expected item 3) and renumber | Item 3 *"Choosing more than one status shows the work orders of all the chosen statuses together."* is **GONE**; old item 4 is now item 3 | ✅ **LANDED, correct** |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | I2 — re-point the Rule-54 provenance from the **epic** to the **owning stories**; sentence 2 untouched | Now reads *"as per story SV-8700 (dark theme)… story SV-8698 (overtime and conflict cues are not colour-only)…"*; build stamp `v3.5-7ec992f on 8/6/2026` preserved | ✅ **LANDED, correct** |

**What remains for pass 1 — deliverables only, no TestRail work:**
1. Write `build/schedule/followup-push-2026-08-11/{FINDINGS,CHANGES-MADE,testrail-execution-log}.md`
   for the two ops above. **The writes are done — do NOT re-execute `exec_followup.py`**; its
   exact-string pre-assertions would now fail, because the anchors it replaces no longer exist.
2. **Run 357 sync is STAGED, NOT EXECUTED** — see §C.

---

### PASS 2 — Filters SV-9041 → **ZERO WRITES LANDED ❌**

**This is the pass whose "Now the writes" was its last word, and the answer is that none of them
happened.** Its folder holds snapshots, evidence and tooling — but **no execution log and no
oplog**, and the live text confirms the absence.

**⚠️ SCOPE CORRECTION — the brief lists 8 cases; the pass's own plan targets 3.**
`tools/plan.py` states verbatim: *"Three cases are touched and no others."* The targets are
**C29601, C38882, C43562**. The other five in the brief (C29602–C29605, C29629, C38903) are **not in
the plan** and nothing was intended for them.

| Case | Intended by `plan.py` | Live content | Verdict |
|---|---|---|---|
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | add tester note *"the Work Orders page offers five filters…"* + add **SV-9041** to provenance | Note **ABSENT**; provenance names only epic SV-8785 + spec v19; **no SV-9041** | ❌ **NOT LANDED** |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | add SV-9041 | `SV-9041` **absent** from expected results | ❌ **NOT LANDED** |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | add SV-9041 **alongside** Branko's 31 July answer, disclosing the divergence (Rule 33/56) | Branko's answer present; **no SV-9041**, no divergence sentence | ❌ **NOT LANDED** |

**Why their timestamps read 14:01–14:03Z anyway — do not be misled.** All three were written at that
time by a **different pass**, the Filters read-date sweep
(`build/filters/read-dates-2026-08-11/`), whose committed oplog lists **114 cases including all
three**. That pass inserted *"read on 11 August 2026"*; it did not touch SV-9041. **A today
timestamp on these cases is not evidence that pass 2 wrote.**

**Re-run recipe for pass 2 — the plan must be REBUILT, not replayed.**
`plan.py` performs exact-string surgery against `snapshots/cases-PRE.json`, which was captured
**before** the read-date sweep. Its anchors (e.g. `C29601_PROV_OLD`, which lacks *", read on 11
August 2026"* and names **spec version 18**) **no longer match live**, so the plan will fail its own
assertions — correctly, and by design.
1. Re-snapshot the 3 cases from live into a fresh `cases-PRE.json`.
2. Update the anchor literals in `plan.py` to the current text (v19 + read-dates).
3. Re-run `plan.py` (it is dry-run only and writes `/tmp/sv9041_plan.json`), then execute with
   byte-verification, then write the execution log.
   *All evidence it needs already survives: `evidence/SV-9041.json`, `-description.txt`,
   `-comments.json`, `-changelog.json`, the attachment, all 19 spec versions and
   `requirement-dating-2026-08-11.json`.*

---

### PASS 3 — Report Suite read-dates → **ZERO WRITES, PROVEN ✅**

No `build/report-suite/read-dates-2026-08-11/` folder exists, and the live suite corroborates it:
**only 2 of the 488 Report Suite cases carry *"read on 11 August 2026"*** — C30452 and C30434, both
written at **06:22Z by the separate `dated-provenance-2026-08-11` pass**, hours before this pass
began. **The other 474 have no read-date at all.** The pass got as far as *"let me read the sibling
passes' method and tooling"* and stopped there. **Nothing to undo; the whole job remains.**

*(Reference implementations for it, both complete and committed:
`build/filters/read-dates-2026-08-11/` and `build/schedule/read-dates-2026-08-11/`.)*

---

### PASS 4 — Schedule labels final → **ZERO WRITES, deliverables COMPLETE ✅**

Folder is `build/schedule/build-viu-2026-08-11/` (not `labels-final-…`). Its
`BUILD-VERIFICATION.md` states **"0 TestRail writes · 0 Jira calls · 0 data seeded · 0 records
modified"**, and live corroborates: every Schedule case's last write is attributable to the
read-dates or staged-push passes.

**Its 12 staged label corrections are in `LABEL-DIFF.md`, unpushed, awaiting a decision.** The pass
stopped deliberately on discovering the JWT leak (§F) — the leaking files are its own
`evidence/diag-*.json`. **Its findings are fully written up**; only the push decision is outstanding.

---

### PASS 5 — Secret redaction → **NOTHING DONE ❌**

No folder, and **all 13 leaking files still contain their tokens** (§F). **The entire job remains.**

---

### PASS 6 — Git sweeper → **COMPLETE ✅**

110 commits committed and pushed, last at 14:23:57Z. Everything the other passes wrote to disk is
preserved. **This is the only reason this recovery had anything to read.**

---

## C. RUNS — integrity proofs

**None of the killed passes was authorised to write to a run, and none did.** Proven by ID against
each run's committed pre-write snapshot, never by count alone.

| Run | `include_all` | Tests | Results (PRE → LIVE) | Prior results missing **by ID** | Graded fields changed | Verdict |
|---|---|---|---|---|---|---|
| **357** Schedule — Ayesha Khan | **false** | **174** | 458 → **529** | **0 of 458** | **0** | ✅ no damage |
| **352** Filters — Ahtasham | **false** | **114** | 473 → **473** | **0 of 473** | **0** | ✅ untouched |
| **359** Report Suite — Nebojsa/Viktoria | **false** | **476** | 535 → **535** | **0 of 535** | **0** | ✅ untouched |

*Snapshots used: `build/schedule/read-dates-2026-08-11/snapshots/run357-results-PRE.json`,
`build/filters/sv9041-2026-08-11/snapshots/run352-results-PRE.json`, `/tmp/rs5/pre-run359.json`.*

**Run 357 — the 71 new results are NOT ours.** All 71 were created at **16:11:05Z by user 6,
Mudassir Qamar** (mudassir.qamar@shopview.com) — after every one of our passes had ended (last
write 14:13Z). Counters now 89 Passed / 6 Failed / 2 Blocked / 77 Untested. **No prior result was
altered.** 3 of the 458 differ only in `case_title` / `case_refs`, the **declared read-time echo**
of case edits, not a graded change.

### ⚠️ RUN 357 IS OUT OF SYNC WITH ITS SUITE — 174 tests vs 176 cases

**Missing from the run: C43588 and C43589** — the two cases pass 1 created. Filters 352 and Report
Suite 359 are both **exactly in sync** (0 missing, 0 extra, both directions).

This is **not damage** — it is the known consequence of `include_all: false` (Rule 34/47), and the
pass behaved correctly: `STAGED-RUN-357-SYNC.md` states **"🛑 NOT EXECUTED. NOT AUTHORISED."**
because run 357 belongs to Ayesha Khan and holds graded results, so the write is the QA lead's call
(Rule 6). **The exact union call and its snapshots are already prepared.**
**⚠️ The staged file's snapshot figures are now stale** — it was written when the run held **458**
results; it now holds **529** after Mudassir's grading. **Re-snapshot before executing, and send the
FULL union** — a partial `case_ids` list deletes tests *and their results*.

---

## D. LOCAL VERSUS LIVE — content compared, not counts

*(Re-run from scratch on the fast-forwarded tree; the stale-tree attempt is discarded.)*

| Suite | Bodies matched | Expected-field differences | Verdict |
|---|---|---|---|
| **Schedule** | 176 of 176 | **0** | ✅ **IN STEP** |
| **Filters** | 114 of 114 | **114** | ❌ **STALE** |

**Schedule is fully resynced** — 176 matched via `testrail-id-map.csv`, zero differences across
title, preconditions, steps and expected results. (203 local bodies = 176 active + 27 retired.)

**Filters local source is stale on every one of the 114 cases**, and it is stale in **two** layers:
- **7 cases** differ *only* by the missing *", read on 11 August 2026"* phrase;
- **the other 107** differ by that **and** by the **spec v18 → v19 re-stamp** — local still reads
  *"Confluence version 18 (published 4 August 2026)"* where live reads *"version 19 (published 6
  August 2026)"*.

> 🔴 **HAZARD: do NOT regenerate the Filters import or id-map from the local case source.** Doing so
> would push the suite back to spec v18 and strip the read-dates — reverting two completed live
> passes. **Re-sync Filters local FROM LIVE first.** The counts (114 / 114 / 114) reconcile perfectly
> *over stale content*, exactly as warned — **counts cannot detect this.**

### C30041 — the fade requirement: **NOT a hazard** ✅

**Live [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) no longer asserts the
fade/highlight requirement**, and local is byte-identical to live (it is one of the 176 with zero
differences). The word "fade" does survive in the local body, but **only inside two non-asserting
passages**: the tester note (*"the specification does not say what happens to the blocks that do NOT
match… Do not pass or fail this test on that"*) and the Rule-56 divergence paragraph, which records
that the sentence *"was in version 23… version 24, published on 6 August 2026, deleted it"* and that
the spec's deletion is the newer decision. **Regenerating Schedule deliverables would NOT resurrect
the deleted requirement.**

---

## E. FOREIGN CASES — all untouched ✅

No foreign case was written by any pass: every one has an `updated_on` **predating today** and an
`updated_by` equal to its own author, **never 3 (us)**.

| Owner | Cases | Last updated | `updated_by` | Touched today? |
|---|---|---|---|---|
| **Ahtasham Amjad** (user 7) — Filters | C43576, C43577, C43578, C43579, C43580 | 2026-08-10 14:24:16Z | 7 | **NO** |
| **Vladimir Tomovic** (user 1) — Report Suite | C38919–C38923 | 2026-07-30 17:41Z | 1 | **NO** |
| **Vladimir Tomovic** (user 1) — Report Suite | C43567–C43573 | 2026-08-08 11:12Z | 1 | **NO** |

**⚠️ CORRECTION TO THE BRIEF: Vladimir now has 12 Report Suite cases, not 5.** Seven more
(**C43567–C43573**) were added on **2026-08-08**. Any deliverable still saying "ours 476 / live 481"
is wrong — **live is 488**.

*Honest limit: proven by author and timestamp, not by a field-by-field diff against a pre-write
snapshot, because no committed snapshot from today captured the foreign cases. A write by us would
necessarily have set `updated_by = 3` and a today timestamp; neither is present on any of the 17.*

---

## F. THE JWT LEAK — scoped, NOT fixed

**Nothing was redacted. No repository setting was changed.**

### 🔴 THE REPOSITORY IS PUBLIC

`bilalmuzamil-sketch/Manual-test-Cases` — `"private": false`, `"visibility": "public"`, 0 forks.
**The tokens below are world-readable, and have been since they were committed.** The default branch
is `claude/slack-session-0sxnd9`, so they are on the branch a visitor lands on.

### The true file list — 13 files, 28 occurrences

| File | Occurrences | Distinct tokens |
|---|---|---|
| `build/report-suite/rulings-2026-08-04/evidence/deact-RepB/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepA-enter/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-confirm/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-dismiss/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-reactivate/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepZ-notoggle/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/fault-RepB-precheck/calls.json` | 2 | 2 |
| `build/report-suite/rulings-2026-08-04/evidence/fault-RepB-submit/calls.json` | 2 | 2 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-roles.json` | 2 | 2 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-roles-fix.json` | 2 | 2 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-staff.json` | 2 | 2 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-staff-fix.json` | 2 | 2 |
| `build/schedule/build-viu-2026-08-11/evidence/staff-diagnosis.log` | 4 | 3 |

**This confirms the reported 5 + 8 split exactly.** Detection pattern: `eyJ[A-Za-z0-9_-]{8,}\.`
(tracked files only, via `git grep`).

### Other credential classes — swept, and clean

| Swept for | Tracked files hit |
|---|---|
| `Bearer ` literal | **0** |
| Cookie prefixes `5f4382b1`, `cbbb1de8`, `f6c4fc3c`, `d8a3efd6`, `PTkkGsPD`, `8703d34c` | **0** |
| TestRail / Jira / prod passwords | **0** |
| `sv_sso_session=` | 8 files — **all templated variables** (`${CK.sv_sso_session}`, `$sv_sso_session`), **no literal values** ✅ |

**Honest limits:** the sweep covers **tracked files at the current HEAD only**. It does **not** cover
(a) **git history** — the tokens remain in earlier commits even after the files are cleaned, so a
redaction commit alone does not remove them from a public repository; and (b) untracked or
`.gitignore`d content. **These tokens must be treated as compromised and rotated regardless of what
the redaction pass does to the files.**

---

## WHAT MUST HAPPEN NEXT, IN ORDER

1. **🔴 Tell the QA lead the repository is PUBLIC and 13 tracked files carry live-shaped JWTs.**
   This is the only item with an external blast radius and it outranks all QA work. Rotation is the
   decision that matters; file redaction is secondary and does not clean history.
2. **Run the secret-redaction pass (pass 5).** Redact the 13 files above. State plainly in its
   deliverable that redaction does **not** remove the tokens from git history, and put the
   history-rewrite/rotation question to the QA lead rather than acting on it.
3. **Re-sync the Filters local case source FROM LIVE — before anyone regenerates a Filters
   deliverable.** 114 of 114 bodies are stale (spec v18 + missing read-dates). Regenerating first
   would revert two completed live passes. **This is the highest-risk QA item open.**
4. **Finish pass 1's paperwork** — write the three `followup-push-2026-08-11` deliverables for the
   two ops that already landed (C29944, C38866). **Do not re-run `exec_followup.py`.**
5. **Re-run pass 2 (Filters SV-9041) — 3 cases, plan REBUILT not replayed.** Re-snapshot C29601,
   C38882, C43562 from live, update `plan.py`'s anchors to the v19 + read-date text, dry-run,
   execute with byte-verification, log. Confirm with the QA lead whether the brief's other five
   cases (C29602–C29605, C29629, C38903) were ever meant to be in scope — the plan says three.
6. **Put run 357's sync to the QA lead** (Rule 6 — Ayesha's run, 529 graded results). C43588 and
   C43589 are missing. **Re-snapshot first** — the staged file's 458-result baseline is stale at 529
   — and send the **full 176-case union**, never a partial list.
7. **Run pass 3 (Report Suite read-dates) from the top** — 474 of 476 cases still need it. Reuse the
   two completed sibling implementations.
8. **Get a decision on pass 4's 12 staged label corrections** in
   `build/schedule/build-viu-2026-08-11/LABEL-DIFF.md`.
9. **Record the stale-checkout hazard in `build/APP-ACTIONS-PLAYBOOK.md`** — fetch and fast-forward
   at the start of every pass; never trust the tracking ref or a clean tree as evidence of currency.

---

## WHAT COULD NOT BE DETERMINED (Rule 12)

1. **Whether pass 2 issued any TestRail call at all before dying.** Live content proves **no write
   landed** on any of its 3 targets, which is what matters. But with no oplog committed, a rejected
   or in-flight call that never took effect cannot be ruled in or out. **Treat the 3 cases as
   unwritten — that is proven; do not infer anything further about attempts.**
2. **Exactly which phase of pass 1 last wrote C38866.** It appears in *both* the staged-push op list
   and the follow-up executor, and TestRail exposes only the most recent write (14:13:08Z). **Both
   ops landed and the final content is correct** — the ordering is simply not reconstructable.
3. **The brief's five extra SV-9041 cases.** C29602–C29605, C29629 and C38903 are **not** in
   `plan.py`. Whether the brief's list or the plan reflects the real intent is a **question for the
   QA lead**, not something to resolve by guessing.
4. **Foreign cases were proven untouched by author + timestamp, not by a field-by-field snapshot
   diff** — no committed snapshot from today captured them. See the note in §E.
5. **Git history was not swept for secrets** — only tracked files at HEAD. The count of *historic*
   exposures is unknown and could be larger than 13.
6. **Why the local tracking ref was 110 commits stale** while reporting the branch as *ahead*. The
   symptom is established and fixed; the mechanism is not, and it may recur in any container.
