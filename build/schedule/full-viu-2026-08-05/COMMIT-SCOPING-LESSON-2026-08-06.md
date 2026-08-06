# Our commit `aa426e38` was not path-scoped and swept a sibling's staged work — 2026-08-06

**What happened, plainly.** The `git add` was path-scoped to `build/schedule/`, so nothing of ours strayed.
But the **commit was not**: `git commit -q -F /tmp/cm4.txt` with no `-- <paths>` takes **the whole index**,
and at that moment the index also held **nine files staged by the live Report Suite worker**. They went into
our commit.

**Nothing was lost.** The files are byte-identical in our commit and are already pushed. The damage is to
the record: our commit message talks only about Schedule work, so the log **misattributes** those nine
files. That worker recorded it in `build/report-suite/full-viu-2026-08-06/COMMIT-COLLISION-2026-08-06.md`.

**It is NOT being fixed, deliberately.** No amend, no rebase, no force push. Rewriting shared history on a
branch two workers are actively pushing to would be far worse than a misleading commit message.

## The two rules that follow, and the second is the one that was wrong in our head

**1. Path-scope BOTH halves.**

```
git add -- <explicit paths>
git commit -F /tmp/msg.txt -- <the same explicit paths>
```

Never `git add -A`, never `git commit -a`, and **never a bare `git commit` that takes the whole index** —
that is exactly what happened here.

**2. Stage and commit IN ONE BREATH. Never leave files sitting staged.**

This is the half we had backwards. **Path-scoping protects what WE commit from sweeping in someone else's
files. It does NOT protect OUR staged files from being swept by someone else's un-scoped commit.** Anything
left in the index is exposed to the other worker for as long as it sits there.

**So: run `git status` immediately before committing.** If paths we do not own are staged, exclude them by
naming only ours in **both** the add and the commit.

## What we own on this branch, and what we must never touch

**Ours:** `build/schedule/**` · `testrail-import/schedule*` · `build/schedule/testrail-id-map.csv`.

**Not ours, hands off:** `build/report-suite/**` · `build/filters/**` · `CLAUDE.md` ·
`build/OUTSTANDING-ITEMS-REGISTER.md`.
