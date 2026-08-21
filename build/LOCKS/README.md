# LOCKS — lane ownership and write claims

> **Standing Rule 83.** Four sessions, one TestRail, one git branch, one staging
> login. **Claim before you write. Check for a foreign claim first. Release when
> done.**

## WHY THIS EXISTS — the three collision modes, named

These are not hypothetical. Each one has either happened here or is one concurrent
pass away, and **all three are SILENT** — nothing errors, so nothing warns you.

1. **Concurrent `update_case` on the same case is LAST-WRITE-WINS, and it is silent.**
   TestRail stores only the **last** writer in `updated_by` / `updated_on`, so when
   two lanes edit one case the earlier edit is **gone with no trace it ever existed**.
   This workspace has already been unable to reconstruct a foreign edit to our own
   **C29557** for exactly this reason.
2. **Two browser sessions on the shared staging login EVICT each other.**
   `quick-login` and `switch-user` **rotate the shared session**, so the second
   session silently invalidates the first one's cookies mid-run. The first lane sees
   a `401 sso_required` and reasonably concludes the estate expired — and it has not;
   it has been evicted by a colleague. **Hence a single browser lock, below.**
3. **Concurrent pushes race.** This one is the mild case: git *does* reject, and the
   remedy is `git fetch origin && git rebase origin/<branch> && git push`. It is
   listed only so nobody mistakes a push reject for a lock failure.

## THE CONVENTION

One claim file per project:

```
build/LOCKS/<project-slug>.lock.md
```

Slugs are the existing project folder names — `filters`, `schedule`, `report-suite`,
`custom-roles`, `simple-flow`, `fees-discounts`, `global-search`.

### A claim file contains, and all five are required

| Field | What it says |
| --- | --- |
| **LANE** | `creation` · `build-verification` · `viu` · `main` |
| **INTENT** | **exactly what it will write** — which cases, which run, which tickets |
| **STARTED** | an ISO-8601 UTC timestamp |
| **EXPECTED RELEASE** | when it expects to be done, and what "done" means |
| **SESSION** | anything that identifies the session, so a human can ask |

Template:

```markdown
# CLAIM — filters
LANE: viu
INTENT: update_case on the 14 raw-markup Filters cases (C29558, C29560, ...).
        No add_case. No run writes. No Jira.
STARTED: 2026-08-21T04:00:00Z
EXPECTED RELEASE: ~90 min, when all 14 are written and byte-verified.
SESSION: slack-session-0sxnd9 / viu lane
```

### The protocol

1. **BEFORE any TestRail write, Jira write, or branch write to a project — CHECK**
   for `build/LOCKS/<project>.lock.md`. `git pull` first; a claim you have not
   fetched is a claim you cannot see.
2. **If a live foreign claim exists — DO NOT WRITE.** Report it to the main session
   and take other work. **Do not "just do the one case"** — that is precisely
   collision mode 1.
3. **If none exists — create yours, commit and push it BEFORE the first write.**
   An unpushed claim is invisible to every other session and protects nothing.
4. **RELEASE when done** — delete the file, commit, push.
5. **The browser/staging login is a SEPARATE, GLOBAL lock:**
   `build/LOCKS/browser.lock.md`. **Only ONE session may drive the browser or call
   `quick-login` / `switch-user` at a time**, regardless of project, because the
   session is shared estate-wide, not per-project.

### Stale claims

**A claim older than 6 hours may be REPORTED and CLEARED — never silently
overwritten.** Clearing it is recorded: who cleared it, when, and on what basis
(the container died, the lane reported finished, the QA lead said so). Silently
overwriting a claim is the same defect as silently overwriting a case — it destroys
the record of who was doing what.

**A stale claim is not proof the work finished.** Check the committed evidence before
assuming it did (Rule 86 — verify from evidence, never from a self-report, and an
absent self-report least of all).

## WHAT A LOCK IS *NOT*

- **Not a substitute for authorisation.** Holding the lock does not authorise a
  write. **Rule 6 still requires the QA lead's permission for TestRail, and Rule 62
  requires it for every Jira ticket** — and while the creation hold is active,
  nothing is created at all.
- **Not a licence to fix another lane's artefact.** A cross-lane finding **ROUTES
  BACK to the main session, which assigns it.** A lane that repairs another lane's
  work unilaterally produces exactly the untraceable edit this whole directory
  exists to prevent (and Rule 38's logic applies with equal force to a colleague's
  work as to a foreign author's).
- **Not advisory.** It is checked, or the writes are not safe to make.

**Ties to Standing Rules** 6 (no write without permission), 29 (no work loss — the
claim lives in git, the only durable store), 38 (another author's work is hands-off),
50 (byte-verify; a lost concurrent write is invisible without it), 62 (the creation
hold), 75/76 (lane discipline and stopping), 83 (this convention) and 86 (verify from
committed evidence).
