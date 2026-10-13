## L. Git practice with parallel workers
- **⚠️ Parallel workers SHARE ONE git index** — a bare `git commit` after `git add <own paths>` also
  commits whatever a sibling worker staged in between, sweeping their half-written files into the
  wrong commit. **Happened TWICE on 2026-07-30/31** (content survived both times, but history got
  muddied).
- **THE FIX (proven working): always commit PATH-SCOPED** — `git commit -- <explicit paths>` (or
  `git commit <paths>`), which commits only those paths regardless of what else is staged. **Never a
  bare `git commit` after staging, and never `git add -A` / `git add .`,** whenever other workers may
  be active. **Syntax gotcha:** `git commit -m "<msg>" -- <paths>` errors ("did not match any
  file(s)") — write the message to a temp file and use **`git commit -F /tmp/msg.txt -- <paths>`**
  (multi-line messages work cleanly this way too). *(proven 2026-07-31)*
- **🛑 STAGE AND COMMIT IN ONE BREATH — NEVER LEAVE FILES SITTING STAGED. This is the half we had
  BACKWARDS (proven 2026-08-06).** **Path-scoping protects what YOU commit from sweeping in someone
  else's files. It does NOT protect YOUR staged files from being swept by someone else's un-scoped
  commit.** Anything left in the index is exposed to the other worker for as long as it sits there.
  **What happened:** a worker ran `git add` correctly path-scoped to `build/schedule/`, but then
  committed with a **bare `git commit -q -F /tmp/cm4.txt`** — which takes **the whole index** — and swept
  in **nine files staged by the live Report Suite worker**. The sibling's own path-scoped commit then
  correctly answered *"nothing to commit, working tree clean"*, because its work was already in someone
  else's commit. **Nothing was lost** (all nine byte-identical, md5-compared file by file, already
  pushed) — **the damage is to the record**: the commit message talks only about Schedule and
  **misattributes** the nine. **It was deliberately NOT fixed** — no amend, no rebase, no force push:
  *"a misleading commit message is a documentation problem; a rewritten shared history is a data-loss
  problem."* Both halves are recorded in `build/schedule/full-viu-2026-08-05/COMMIT-SCOPING-LESSON-2026-08-06.md`
  and `build/report-suite/full-viu-2026-08-06/COMMIT-COLLISION-2026-08-06.md`.
  **THE PRACTICE:** `git status` **immediately before** committing; if paths you do not own are staged,
  name only yours in **BOTH** the add and the commit; then **`git add -- <paths>` and
  `git commit -F /tmp/msg.txt -- <the same paths>` back to back, with nothing in between.**
- **🛑 `git push <branch>` RESOLVES THE REF AT PUSH TIME, so a concurrent commit can be published
  UNSCANNED.** Between the moment you review/scan a diff and the moment the push runs, a sibling worker
  can add a commit to the same branch — and pushing the **branch name** publishes whatever the tip is
  then, including work you never looked at. **PUSH THE EXPLICIT REVIEWED SHA:**
  `git push origin <sha>:refs/heads/<branch>`. Report the pushed SHA and confirm it equals the SHA you
  scanned. *(2026-08-06)*
- **⚠️ A REMOTE-TRACKING REF READ WITHOUT A PRIOR `git fetch` IS STALE — and it produced a false
  work-loss scare.** `origin/<branch>` is only as fresh as your last fetch, so `git rev-parse
  origin/<branch>` can report *"local == origin, all pushed"* while local is in fact **49 commits
  behind**. **Always `git fetch origin <branch>` FIRST**, then compare — and never conclude anything
  about what is or is not on the remote from an unfetched ref. *(2026-08-06)*
- **🛑 THE SAME STALENESS BITES IN THE OTHER DIRECTION, AND IT IS FAR MORE DANGEROUS: THE LOCAL
  CHECKOUT CAN BE WILDLY BEHIND WHILE `git status` REPORTS THE BRANCH *AHEAD* AND THE TREE CLEAN
  (proven 2026-08-11 — 110 commits behind).** The bullet above is about mis-reading what is on the
  remote. **This is about working from a tree that is out of date and not being told.** A recovery pass
  found `git status` clean and `git rev-list` reporting the branch **1 commit AHEAD**; after
  `git fetch` the true position was **110 BEHIND, 0 ahead**. **WHAT IT COST:** that pass concluded six
  other passes' folders **did not exist**, that **nothing had been committed**, and that **all their
  work was lost with the container** — **every one of those conclusions was false.** The folders, the
  execution logs and the per-op records were all on the remote, invisible to a stale checkout.
  **WHY IT MATTERS MORE THAN A WRONG STATUS REPORT: another session pushes to this same branch from a
  different container, so a worker reading a stale tree WHILE WRITING TO LIVE TESTRAIL can re-do work
  already done, "restore" text another pass deliberately changed, or regenerate deliverables from a
  source 110 commits out of date** — each of which is a confident, well-evidenced, wrong answer.
  **THE RULE: `git fetch origin <branch>` then `git merge --ff-only` as the FIRST ACTION of every pass,
  before reading anything.** **A clean working tree proves nothing about currency**, and neither does
  an ahead/behind count taken without a fetch. **If the fast-forward is refused, STOP and report** —
  never force, never rebase, never `reset --hard`, because a sibling's unpushed-to-you commits are the
  very thing at risk. *(2026-08-11; the mechanism behind the stale ref is still unexplained and may
  recur in any container — see `build/RECOVERY-2026-08-11/STATE.md`.)*
- **🛑 `git add -- <paths>` IS NOT THE GUARD. THE PATHSPEC HAS TO BE ON THE `git commit`. (Bit us
  TWICE on 2026-09-03 — incidents four and five.)** Both workers **did** scope their `git add`, and
  both were swept anyway: one commit took **five** foreign files (another worker's handoff and skill
  edits), the next took **seven** (`CLAUDE.md`, rule files, skills, `build/handoffs/README.md`,
  `build/PROCESS-AUTHORING-STANDARD.md`). **WHY SCOPING THE `add` CANNOT WORK: the index is shared and
  the race is AFTER your add.** A sibling's `git add` lands between your `add` and your `commit`, and
  a bare `git commit` then takes the whole index — theirs included. The commands, in one breath:

  ```bash
  git add    -- <your paths>                     # hygiene; NOT the guard
  git commit -m "<msg>" -- <the same paths>      # THE GUARD: pathspec, immune to index state
  git show --stat --oneline HEAD                 # read the count, then push the explicit SHA
  ```
- **🛑 AND THE PATHSPEC GUARD HAS ITS OWN BLIND SPOT: A PATHSPEC COMMIT SILENTLY DROPS A RENAME'S
  DELETION SIDE, SHIPPING BOTH COPIES OF THE FILE (hit 2026-09-03).** `git mv old new` stages **two
  halves** — the DELETE of `old` and the ADD of `new`. **`old` no longer exists in the worktree, so it
  never makes it into the pathspec you type**, and a pathspec commit records only what it names: the
  add lands, the delete does not, and **the commit contains BOTH files**. Caught by reading the stat
  line; it would otherwise have shipped a duplicated rules file.
  **THE TELL — and note the file COUNT does not catch this one:**

  ```text
   1 file changed, 1 insertion(+)          # pathspec = new path only  -> WRONG
   create mode 100644 NEW.md               #   `create mode` with NO `delete mode`/`rename` line
   1 file changed, 0 insertions(+)         # pathspec = BOTH paths     -> RIGHT
   rename OLD.md => NEW.md (100%)          #   git says `rename` when it got both halves
  ```

  A correct rename prints **`rename old => new`**; the broken one prints **`create mode`** and nothing
  about the old path. **`N files changed` reads `1` in BOTH cases** (re-verified in a scratch repo,
  2026-09-03), so the count check that catches the sweeping trap is **not sufficient here** — in a
  larger batch it shows up only as a count one off from the paths you meant to touch. **⇒ read the
  mode/rename summary lines, not just the count.**
  **THE FIX: name BOTH the old and the new path —** `git commit -F /tmp/msg.txt -- <old> <new>`. The
  old path is still a valid pathspec although the file is gone (it matches the staged deletion; proven,
  same scratch repo), and a sibling's separately staged file stayed untouched. Equivalently, run
  **`git status --porcelain` before committing** and confirm every `R`/`D` entry you meant is covered
  by your pathspec — an `R  old -> new` line is the warning that one pathspec entry is not enough.
  **RECOVERY:** unpushed → `git commit --amend -F /tmp/msg.txt --only -- <old> <new>`; **pushed → leave
  it and fix forward in a new commit — never rewrite pushed history** (the standing ruling below).
- **✅ CORRECTION TO THE 2026-07-31 SYNTAX GOTCHA ABOVE (re-tested 2026-09-03, git 2.43.0):
  `git commit -m "<msg>" -- <paths>` WORKS.** The bullet near the top of §L says it errors with *"did
  not match any file(s)"* and routes you to `git commit -F /tmp/msg.txt -- <paths>` instead. Re-tested
  directly — a scratch repo, a sibling's file staged in the index, a **multi-line** `-m` message with a
  trailer — it committed **`1 file changed`**, left the sibling's staged file untouched, and exited 0.
  **`-F` remains fine and is still the easier route for a long message; the point of the correction is
  that the `-m` form is NOT broken**, and steering workers off it steered them onto the bare
  `git commit` that causes this whole class of incident. (If it ever does error, the cause is a
  pathspec that matches nothing — check the path, not the flag.)
- **⚠️ BUT `-m "…"` HAS A REAL AND DIFFERENT HAZARD, AND IT IS SILENT: BACKTICKS IN THE MESSAGE ARE
  COMMAND SUBSTITUTION (hit 2026-09-03, writing the commit for this very amendment).** A commit
  message quoting code in backticks — e.g. a bare `` `except Exception: pass` `` — is a
  **double-quoted bash string**, so the shell EXECUTES the backticked text and substitutes its
  output. What landed in the commit was *"the activity feed's bare  would have swallowed the"*, with
  the quoted code simply GONE. The only visible sign was one stray line on stderr
  (`except: command not found`) **after** the commit had already succeeded — the commit itself
  reported `6 files changed` and exit 0. **⇒ For any message containing backticks, `$`, `!` or `\`,
  write it to a file and use `git commit -F /tmp/msg.txt -- <paths>`** (which is why the 2026-07-31
  bullet reached for `-F` in the first place — the reasoning was right even though the stated error
  was not). **And READ THE MESSAGE BACK — `git log -1 --format=%B` — before pushing**, exactly as you
  read the `N files changed` line: the file count and the message are two different checks, and this
  one fails without an error. Amending is safe here **only because nothing had been pushed**; do it
  with `git commit --amend -F /tmp/msg.txt --only -- <the same paths>` so the amend cannot sweep a
  sibling's index either.
- **🛑 READ THE `N files changed` LINE. IT IS THE ONLY CHECK THAT ACTUALLY CATCHES THIS.** Compare N
  against the number of files you changed; **if N is larger, STOP — do not push.** The second
  2026-09-03 incident was caught exactly this way (`11 files changed` where 4 were expected).
- **THE RECOVERY, AND ITS ONE PRECONDITION — NOTHING HAS BEEN PUSHED.** Then, in order:
  `git reset --soft HEAD~1` (**soft** — the work stays in the tree) · **back up every affected file
  first, the foreign ones included** · `git restore --staged -- <foreign paths>` · re-commit with an
  explicit pathspec · **`diff`/`sha256sum` the foreign files against the backup and record that they
  are identical.** The byte-comparison IS the evidence that the sibling's work survived; an uncommitted
  comparison did not happen (Rule 29 R4). That is how incident five was closed the same day: reset,
  backed up, byte-compared identical, re-committed path-scoped, nothing lost.
  **ONCE IT IS PUSHED, DO NOT TOUCH IT** — no amend, no rebase, no force. A sibling may already have
  fetched it, so a rewrite turns a documentation problem into a data-loss problem (the standing ruling
  two bullets up, 2026-08-06). Report it to the coordinator and leave it. *(Rule 29 R7 amendment,
  2026-09-03.)*

