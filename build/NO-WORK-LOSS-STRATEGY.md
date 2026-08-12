# No-Work-Loss Strategy — never lose finished work

> **This is STANDING RULE 29 in CLAUDE.md — PERMANENT, for every project AND every side project.**
>
> **ORIGIN (2026-07-29), USER DIRECTIVE, verbatim:** *"you have to make sure that if we hit the daily
> limit we do not loose anything and this should be a permanent rule for every project or side
> project you work on"*.
>
> **STRENGTHENED 2026-08-11 after a six-worker kill, USER DIRECTIVE, verbatim:** *"there are the
> chances that again we will lose all the work due to 5 hours limit issue, so we have to make sure
> that we have a permanent strategy or a rule that protects us from losing our work due to these
> limit issues."*

Plain-English rules so a usage-limit kill, container restart, or dead worker never costs us finished
work. **Read this at the START of every pass, not only when a limit is near.**

---

## 🔴 WHY THE ORIGINAL RULE WAS NOT ENOUGH — six real failures, all from 2026-08-11

The work survived that day. **It survived for a bad reason: a sweeper worker happened to be
committing other passes' output, and the recovery that followed first reached a false conclusion and
had to withdraw it.** Every requirement below is written against one of these, not against theory.
The audit is `build/loss-audit-2026-08-11/VERDICT.md`.

| # | What actually happened | What it would have cost |
|---|---|---|
| **1** | A pass wrote to TestRail for **~40 minutes with no checkpoint commit** | the whole batch |
| **2** | The local checkout went **110 commits stale**; `git status` said *clean* and `git rev-list` said *1 ahead*. Both wrong | a recovery pass concluded **all six passes' work was lost** — false, and withdrawn |
| **3** | A killed pass left **TestRail half-written with no committed record** of which ops had landed | nobody could tell written from unwritten without re-deriving it from live |
| **4** | A pass's **byte-comparison output lived only in `/tmp`** and died with the container | **the one thing actually lost on 2026-08-11.** Its writes landed; its proof did not |
| **5** | A **`pgrep -f` liveness check matched the watching shell's own command line**, so it returned *true* forever | a batch **silently never ran** while reporting healthy |
| **6** | An **HTTP 500 came back from a write that had already succeeded**; separately, a **fresh `updated_on` appeared on three cases whose intended write never happened** | a blind retry would have written over a landed change; a timestamp check would have called three failures a success |

**The through-line: on the day, almost every signal a pass naturally trusts — its own memory, a clean
tree, a status code, a timestamp, a liveness check — lied at least once.** The only things that did
not lie were **committed records** and **live content read back**.

---

## GOLDEN RULE

**All durable work lives in GIT — committed AND pushed to `origin/<branch>` after every meaningful
step.** The container and `/tmp` are **EPHEMERAL**: they do not survive a restart or a limit kill.
**Only what is pushed to the git remote survives.** Never leave finished work uncommitted or unpushed.

---

# THE SEVEN REQUIREMENTS

**These are checkable. A pass that cannot show them is non-compliant, and a reviewer should say so.**

## R1 — 🔑 THE PER-OPERATION LOG IS WRITTEN **BEFORE OR AS** EACH WRITE, AND IS COMMITTED

**This is the single highest-value requirement. If only one thing on this page is done, do this one.**

An oplog written **at the end of a run** is worthless to a run that dies in the middle — which is
exactly the run that needs it. So:

- **Append one line per operation to an on-disk oplog, and `flush()` it, at the moment of the write —
  not in a buffer, not at the end.** Record: **case/entity id · verb · intended fields · HTTP status ·
  verification result · UTC timestamp.**
- **Write the INTENT line before the call, then complete it with the outcome after.** An op that
  appears with an intent and no outcome is the precise point at which the pass died — which is the
  question a resume most needs answered.
- **The oplog is inside the pass's committed folder** (`<pass>/oplog.json` or
  `<pass>/testrail-execution-log.md`), **never in `/tmp`.**
- **It is committed and pushed on the R2 cadence** — an uncommitted oplog dies with the container just
  as surely as the work it describes.

**The test of compliance:** *if this worker is killed right now, can the next one determine its exact
position from `git` alone, without re-deriving it from live?* **If no, R1 is not met.**

## R2 — A HARD CHECKPOINT INTERVAL, STATED AS NUMBERS

**"Commit regularly" is not a rule — it is what failure #1 was already doing.**

> ### Commit **and push** at least every **25 write operations**, or every **10 minutes of wall
> clock**, whichever comes first.

- On a **long batch**, checkpoint at fixed op counts (the proven shape:
  `checkpoint after 105 of 343`, `205 of 343`, `305 of 343`).
- On an **exploratory or evidence-gathering** pass, the **10-minute ceiling governs** — there are no
  ops to count, and this is precisely where a 40-minute silent stretch grows.
- **A checkpoint commit never waits for a clean stopping point.** A half-finished findings file
  committed is worth more than a perfect one lost.
- **Maximum exposure by construction: 25 operations or 10 minutes.** That is the number to quote when
  asked "what would a kill cost us right now?"

## R3 — FETCH AND FAST-FORWARD AT THE START OF EVERY PASS

**Another session pushes to this branch from a different container. A clean tree proves nothing about
currency.**

```
git fetch origin <branch> && git merge --ff-only
```

- **Never trust the local tracking ref, or `git status`'s ahead/behind, without fetching first.** On
  2026-08-11 they reported *clean* and *1 ahead* while the checkout was **110 commits behind**.
- **Never `--force`, never `rebase`, never `reset --hard`.** If the fast-forward is refused, **STOP and
  report** — a refused fast-forward means genuine divergence and is not a worker's call.
- **Re-fetch before every push too.** Passes run for hours; the remote moves under them.
- **A pass that reports on repository state without having fetched is reporting on a snapshot of
  unknown age**, and its conclusions — especially any conclusion that something is *missing* — are
  worthless. This is failure #2, and it produced a confident, fully-evidenced, wrong answer.

## R4 — VERIFICATION EVIDENCE IS COMMITTED TO THE REPOSITORY, NOT LEFT IN `/tmp`

**This is the requirement written directly from the only thing actually lost on 2026-08-11.**

- **Pre-write snapshots, post-write re-GETs, byte-comparison output, diff reports and proof sets go in
  the pass's committed folder.** `/tmp` is for **secrets only** — cookies, tokens, OTP codes, which
  are *supposed* to die and are re-supplied by the user.
- **A Rule-50 byte-comparison whose output is not committed did not happen, evidentially.** The work
  may be perfect and unprovable — and unprovable work has to be redone or reconstructed, which is a
  cost either way.
- **Keep it proportionate:** commit the **proof set** — the ids, the field-by-field comparison result,
  the counts — not necessarily a multi-megabyte raw harvest. The test is whether **someone else can
  re-derive the verdict**, not whether every byte is preserved.
- **Scan before committing** (`build/testing-tools/scan_secrets.py --staged`) — evidence files are the
  most common way a credential reaches a public repository, which is how 12 JWTs got out.

## R5 — RESUME BY RE-ESTABLISHING POSITION FROM **LIVE**, BY CONTENT

**A resuming pass has no memory. It must not act on one.**

1. **`git fetch` + `--ff-only`** (R3) — before reading anything.
2. **Read the killed pass's committed oplog** (R1) — the claimed position.
3. **VERIFY that claim against LIVE, BY CONTENT** — compare live text against the pass's **intended
   payload**, field by field.
4. **Complete only what is verifiably missing.** Never redo a verified write; never assume the last
   logged op finished.

> ### 🛑 NEVER decide "did it land?" from a timestamp, a status code, or a liveness check.
> - **A fresh `updated_on` is not proof of your write.** Three Filters cases carried the current day's
>   timestamp from an *unrelated* pass while the intended write had never happened.
> - **TestRail can re-render case text hours later without moving `updated_on` at all** — so the
>   timestamp is unreliable in *both* directions.
> - **HTTP 500 does not mean the write failed.** One did succeed behind a 500. **The safe response to
>   a 500 on `update_case` is to READ THE CASE, not to re-send** — a blind retry with a rebuilt payload
>   writes on top of a change that already landed. Rule 50 bars the blind retry anyway.
> - **A liveness check is not evidence of progress — check the work product.** And **never `pgrep -f`
>   a pattern that appears in the watching shell's own command line**: it matches itself and returns
>   *true* forever.

## R6 — THE PRE-KILL STATE-SAVE

**When a limit or reset is in prospect — and on this workspace it always is — write the cold-resume
block and push it.** Three headings, no more:

- **DONE** — what is finished and verified, with the evidence path.
- **IN FLIGHT** — what is part-done, **with its exact re-run recipe**, and an explicit note if the
  recipe must be **rebuilt rather than replayed** (see the trap below).
- **AWAITING WHOM** — what is blocked, on whom, since when (Rules 36 / 48).

It goes in the pass folder and in the relevant `PROJECT-STATE.md`.

> **⚠️ THE REPLAY TRAP, PROVEN TWICE.** A staged plan that performs **exact-string surgery** against a
> pre-write snapshot **cannot simply be re-run later** — a sibling pass may have moved the very
> anchors it matches on, so it fails its own assertions (correctly, by design). **Say so in the
> recipe.** On 2026-08-11 both the Filters SV-9041 plan and the Schedule follow-up executor were in
> this state, and re-running either would have failed or double-written.
>
> **And the upside, recorded because it is not obvious:** the SV-9041 plan was **rebuilt from the
> source rather than replayed**, and the rebuild produced a *better* result — it dropped a case that
> did not belong and found a coverage gap the original had missed.

## R7 — COMMIT PATH-SCOPED; PARALLEL WORKERS SHARE ONE GIT INDEX

- **`git add <explicit paths>` — never `git add -A`, never `git add .`.**
- **`git commit -m "…" -- <explicit paths>` — never a bare `git commit` after staging.** A bare commit
  sweeps whatever a sibling staged in between into your commit. **This has happened three times**
  (2026-07-30, 2026-07-31, and again on 2026-08-11 in `5775229d`).
- **`git show --stat` after committing** — confirm you committed what you meant and nothing else.
- **Push the explicit SHA**: `git push origin <sha>:<branch>`. **Never force.**
- **Expect HEAD to move under you.** It is normal here, not an error.

---

## THE COMPLIANCE CHECKLIST — a pass can be failed on this

| | Requirement | How a reviewer checks it |
|---|---|---|
| ☐ | **R1** oplog written per-op, committed | the oplog is in the pass folder in git, with per-op HTTP + verification |
| ☐ | **R2** ≤ 25 ops / ≤ 10 min between checkpoints | `git log` timestamps on the pass folder |
| ☐ | **R3** fetched + fast-forwarded at pass start | stated in the execution log with the resulting SHA |
| ☐ | **R4** verification evidence in the repo | snapshots / proof set committed, not referenced in `/tmp` |
| ☐ | **R5** resume verified against live by content | the log says what was compared, not just "resumed" |
| ☐ | **R6** state-save present | DONE / IN FLIGHT + recipe / AWAITING WHOM |
| ☐ | **R7** path-scoped commits | `git show --stat` contains only this pass's files |

---

## RESUME ANCHORS

- **`CLAUDE.md`** — project entries, standing rules, durable facts.
- **`build/<project>/PROJECT-STATE.md`** — each project's authoritative snapshot.
- **The pass's own `oplog` + execution log** — the operation-level position.

A fresh session resumes: **`CLAUDE.md` → the relevant `PROJECT-STATE.md` → `git log` → the killed
pass's oplog → live verification.** Keep the anchors current **as work completes**; an anchor that
lags is a resume trap.

---

## SECRETS RE-SUPPLY (lost on every restart — by design)

Cookies, tokens and OTP codes live in **`/tmp` only** and are lost on restart. **This is the one
acceptable loss.** On resume the **user re-supplies**: fresh staging/QA cookies (~24 h life, and they
also die on deploy) and fresh Jira/Confluence OTP (`build/ATLASSIAN-JIRA-ACCESS-METHOD.md`).

**No durable work may depend on a secret surviving.** Only live-verification steps pause.

---

## WORKER / COORDINATOR DISCIPLINE

- **Workers commit and push their OWN work.** A worker never ends — or risks a limit — holding
  uncommitted changes. Its commits are its recovery points.
- **A worker does not rely on a sweeper.** On 2026-08-11 a sweeper saved the day; **that was luck, not
  architecture**, and it is the reason R1 and R2 exist.
- **The coordinator state-saves before a known limit** (R6) and tells in-flight workers to
  checkpoint-commit now.

---

## POST-RESET RESUME STEPS

1. **`git fetch` + `git merge --ff-only`** — **first, before reading anything** (R3).
2. Read `CLAUDE.md`, then the relevant `PROJECT-STATE.md`.
3. Read the killed pass's oplog and state-save.
4. **Re-establish position from LIVE, by content** (R5).
5. Re-supply cookies / OTP (user provides).
6. Continue from the verified remaining scope — **rebuilding, not replaying, any exact-string plan.**
