# No-Work-Loss Strategy — never lose finished work

> **2026-07-30: This is now STANDING RULE 29 in CLAUDE.md — PERMANENT, for every
> project AND every side project.** USER DIRECTIVE (2026-07-29): "you have to make
> sure that if we hit the daily limit we do not loose anything and this should be a
> permanent rule for every project or side project you work on". Proven across the
> 2026-07-28/29 daily-limit hits: zero work lost.

Plain-English rules so a usage-limit kill, container restart, or dead worker never
costs us finished work. Read this whenever a limit is near or a worker dies.

## GOLDEN RULE
**All durable work lives in GIT — committed AND pushed to `origin/<branch>` after
every meaningful step.** The container and `/tmp` are EPHEMERAL: they do NOT survive
a restart or a usage-limit kill. Only what is pushed to the git remote survives.
Never leave finished work sitting uncommitted or unpushed.

## CHECKPOINT GRANULARITY
Commit + push after each small unit — each case, role, batch, or story — never hold
a large batch of uncommitted work. Multi-item jobs (VIU passes, imports, audits,
comparisons) commit incrementally, so a mid-run kill loses at most the ONE item in
flight, not the whole batch. Push after each checkpoint, not just at the end.

## RESUME ANCHORS
The canonical resume docs are:
- **`CLAUDE.md`** — the 7 project entries + standing rules + durable facts.
- **`build/<project>/PROJECT-STATE.md`** — each project's single authoritative
  snapshot (case inventory, TestRail state, deliverables index, open threads,
  env/access, how-to-resume).

A fresh session (after the limit resets) resumes by reading, in order:
`CLAUDE.md` → the relevant `PROJECT-STATE.md` → the git history (`git log`).
Keep both anchors current AS work completes — an anchor that lags is a resume trap.

## IN-FLIGHT KILL RECOVERY (worker/agent dies from limit or restart)
- The worker's **last pushed commit** is the recovery point.
- Its partial **FINDINGS / state note** says what is done vs remaining.
- Relaunch with only the REMAINING scope.
- Workflow runs: resume with `resumeFromRunId`.
- Agent workers: re-launch the remaining items (don't redo the finished ones).
- **Killed-worker resume recipe (proven 2026-07-29 wave-completion):**
  1. Check the worker's LAST OUTPUT (its per-op log / last pushed commit) to see
     exactly which operations it reported complete.
  2. VERIFY the live state (re-GET the TestRail cases / re-read the live system)
     against that log — never trust the log alone, and never assume the last
     logged op finished.
  3. Complete ONLY what is verifiably missing — never redo verified writes.

## RESUMABLE WRITE SEQUENCES (TestRail / Jira — proven 2026-07-28/29)
Every in-flight TestRail/Jira write sequence must be resumable:
- **Pre-write snapshots**: capture the current live state of every case/entity you
  are about to touch BEFORE the first write (backup files committed to git).
- **Per-operation logs**: log each op (case ID, verb, HTTP status, re-GET verify)
  as it completes — one line per op, flushed immediately, committed to git — so a
  killed run can be verified op-by-op and finished from exactly where it stopped.
- **Per-op verification**: each write is verified (re-GET MATCH) before the next;
  a resume can therefore trust the log's verified entries.

## WORKER / COORDINATOR DISCIPLINE (proven 2026-07-28/29)
- **Background workers commit + push their OWN work** — a worker never ends (or
  risks a limit) holding uncommitted changes; its commits are its recovery points.
- **The coordinator state-saves BEFORE limits**: when a limit/reset risk is known,
  the coordinator writes the cold-resume block (what's DONE, what's IN FLIGHT with
  its exact re-run recipe, what's AWAITING WHOM) into the relevant
  PROJECT-STATE.md and pushes it, and tells in-flight workers to checkpoint-commit.
- **⚠️ COMMIT PATH-SCOPED — parallel workers share ONE git index.** A bare `git commit`
  after `git add <own paths>` also commits whatever a sibling worker staged in between,
  sweeping their half-written files into the wrong commit (**happened twice on
  2026-07-30/31**; content survived both times but history got muddied). **Fix (proven):
  always `git commit -- <explicit paths>` (or `git commit <paths>`); never a bare
  `git commit` after staging, and never `git add -A`/`git add .`, when other workers may
  be active.** Recipe also in build/APP-ACTIONS-PLAYBOOK.md §L.

## SECRETS RE-SUPPLY (lost on every restart/limit)
Cookies, tokens, and OTP codes live in `/tmp` ONLY and are LOST on restart/limit —
this is by design (never commit secrets). On resume the USER re-supplies:
- Fresh **staging cookies** (`~24h` life) for live-build checks.
- Fresh **Jira/Confluence OTP** — login method =
  `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`.
No durable work depends on secrets surviving; only live-verification steps pause
until fresh secrets arrive.

## PRE-LIMIT CHECKLIST (run this when a limit is near — like now)
1. **Tree clean + HEAD == origin** — everything committed AND pushed
   (`git status` clean; `git rev-list --left-right --count origin/<branch>...HEAD`
   = `0  0`).
2. **CLAUDE.md + every PROJECT-STATE doc current** — reflect what just finished.
3. **Tell in-flight workers to checkpoint-commit** now (flush partial work).
4. **Write what's in flight + what remains** into the relevant PROJECT-STATE (or a
   short RESUME note) so the post-reset session picks up cleanly with no guessing.

## POST-RESET RESUME STEPS
1. Read `CLAUDE.md`.
2. Read the relevant `build/<project>/PROJECT-STATE.md`.
3. Re-supply cookies / OTP (user provides; see access method doc).
4. Continue from the documented REMAINING scope (last pushed commit is the floor).
