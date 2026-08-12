# Schedule finish4 — PHASE 1: what the killed pass completed, proven by content

**Read at 2026-08-12T09:58Z.** A container restart killed the `finish3` worker.
Its position was re-established **from git and from live TestRail**, never from assumption.

## The headline

**The killed pass had finished its work. It died during the write-up, not during the writes.**

| | |
|---|---|
| finish3 cases walked | **28** (30 probe records exist; 2 were explicitly recorded as NOT walked — see below) |
| finish3 TestRail writes | **19** `update_case`, over 19 distinct cases |
| **Writes verified LANDED, by content** | **19 / 19** |
| The other 9 walked cases | **no write was needed** — each already carried the correct stamp, verified live |
| Work lost | **none** |

## 1 · What was sitting untracked, and what happened to it

`git status` found exactly one untracked file: **`build/schedule/finish3-2026-08-12/DIVERGENCES.md`**
(8,909 bytes, written 09:20). It was **committed unchanged** as `eb639a59` and pushed **before any
other work began**. Nothing else was uncommitted — `evidence/` and `tools/` were already tracked
across the pass's five checkpoint commits.

**A previous recovery on this repository concluded everything was lost, from a stale checkout, and
was wrong.** So: `git fetch origin claude/slack-session-0sxnd9` then `git merge --ff-only` ran
**first**; the branch was already current at `96d97c65`.

## 2 · The writes, verified BY CONTENT — never by `updated_on`

A fresh `updated_on` is **not** evidence a write landed (TestRail re-renders text without moving the
timestamp at all, and an HTTP 500 can come back from a write that succeeded). So every one of the 19
cases was **re-read live and its body searched for the exact content the operation claimed to leave
behind** — `tools/recover.py`, output `evidence/recover-writes.json`.

Per case, all of: the Rule-54 sentence 2 reading `Last checked against build v3.5-65d6500 on
12 August 2026.` · **exactly one** stamp · **exactly one** `AUTOMATION:` marker · **no raw markup**.
And, where the operation claimed a content change, both directions were checked — the **new text
present** and the **old text absent**:

| Case | Extra content check | Result |
|---|---|---|
| C29973 · C29974 · C29975 | the BLOCKED-not-failed note present **and** `AUTOMATION: HOLD - the Unassigned row does not exist` | present |
| C29980 | `on this build that no longer happens` present **and** the stale `Note on point 2:` **gone** | both |
| C30064 | `stays on screen for between 4 and 7 seconds` present **and** `persists about 7 seconds` **gone** | both |
| C29967 | `All <number of lines>` present **and** `'All 27' chip` **gone** | both |

**19 of 19 landed. 0 partial, 0 missing, 0 needing a retry.** No case was blind-retried.

## 3 · The 9 walked cases that received no write

`29956 · 29958 · 29963 · 29965 · 29978 · 29981 · 29982 · 29984 · 30016` — each was **re-read live**
and already carried **exactly one** correct build stamp, so a re-stamp would have been a no-op. That
is why the oplog holds 19 operations for 28 walked cases; it is not a truncated log.

## 4 · Two probe records that are NOT walked cases

`walk_*.json` holds 30 keys, but the pass's own write list holds 28, and the two it excluded are
excluded **on the record**, in `tools/write.py`:

- **C30057** — *"no series block was reachable on screen, so it was not walked."*
- **C38863** — *"the 8-week guard was never provoked from the interface."*

Both are counted here as **not walked**. A probe that touched a case is not a case whose steps were
verified.

## 5 · The position, re-derived rather than carried forward

Computed live from TestRail against `finish2`'s `remaining.json` — `evidence/position.json`.

| | Before finish3 | After finish3 |
|---|---|---|
| Total cases (group 4254) | 176 | 176 |
| **Preconditions and steps walked** | **96** | **124** |
| Never walked by anybody | 80 | **52** |
| — of those, already on `HOLD` | 25 | 25 |
| **Genuinely remaining** | **55** | **27** |

The walked figure is a **union by case id** across every Schedule pass, not a sum of per-pass
counts, so nothing is double-counted.

**The 27 remaining:** `29962 · 29971 · 29986 · 30005 · 30017 · 30018 · 30031 · 30057 · 30060 ·
30065 · 30068 · 30072 · 30073 · 30080 · 30083 · 30615 · 38849 · 38850 · 38851 · 38863 · 38864 ·
38865 · 38866 · 38870 · 38875 · 43556 · 43589`.

**The cheap eleven the killed pass was chartered to do are DONE** — Shift Start Times 7 of 7
(C29969–C29975) and Events, and so are the 20 drag-dependent cases. **The drag worked.**
