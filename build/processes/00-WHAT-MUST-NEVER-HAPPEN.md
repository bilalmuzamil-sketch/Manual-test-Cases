# WHAT MUST NEVER HAPPEN — the things that would land the QA lead in trouble

> **Not callable. Every process obeys this, and no process may report success while any check here
> is unmet.**
>
> The QA lead's words: *"These processes must never get me bitten — I can lose my job due to your
> little mistake."* That is the correct way to think about it. What follows is not a list of good
> intentions; it is the specific failures that would do the damage, what each one would cost him,
> the guard, and **whether that guard is mechanical or depends on my judgement** — because he is
> entitled to know which of these is actually hard to get wrong and which still rests on me.

---

## The eight that would do real damage

### 1 · Telling him something is tested when it is not
**What it costs him:** he reports the feature as covered, a bug reaches a customer, and the question
is why QA said it was tested.
**The guard:** *Verified means OBSERVED, never inferred* (Rule 12). Nothing is marked Passed from
reasoning, from a previous run, or from how it "must" behave. Anything not observed is **NOT
VERIFIED** or **Blocked-with-reason**.
**Mechanical?** Partly. Evidence is captured per run; an unevidenced claim is visible in review. But
**the discipline itself is mine** — this one depends on my honesty, and he should know that.

### 2 · Destroying results in TestRail
**What it costs him:** a run's history is gone, and someone has to re-run it. Irreversible.
**The guard:** 🔴 run sync is **UNION-ONLY**. A partial `case_ids` list **DELETES** tests and their
results (Rule 34). Read the run's current ids, add ours, send the union. **Never delete a case** —
deleting takes its test and results with it.
**Mechanical?** **Yes.** `safety_check.py --run <id>` records the count before and refuses a sync
that would reduce it.

### 3 · Filing a ticket nobody sanctioned
**What it costs him:** his name on a ticket he never approved, in front of developers and the PO.
**The guard:** **permission is PER TICKET**, asked and granted each time (Rule 62). An earlier batch
approval never covers a later one. A finding being obviously real is not permission. API-related
tickets are asked about every time, even inside an approved batch (Rule 51).
**Mechanical?** No — **this one is mine to hold.** It is written into process 15 as a hard stop, and
the process produces *approved candidates*, never filed tickets.

### 4 · A false bug report to the developers
**What it costs him:** credibility. The next real finding gets argued with.
**The guard:** the three legs — **attribution, identity, provenance** (process 0). Plus: search Jira
first (on Global Search **all six** "new" findings already had a ticket), prove a "not found" with a
control, and rule out a stale identifier or an unindexed record before calling anything a bug.
**Mechanical?** Partly — `attribution_check.py` exists and the verifiers enforce identity. The
judgement of *"is this really the product's fault"* is mine.

### 5 · Leaking a credential into a public repository
**What it costs him:** a security incident with his name on the commit.
**The guard:** secrets live in `/tmp`, `chmod 600`, **never committed** (Rule 82). The scanner runs
on the staged diff before every commit; exit 1 means refuse.
**Mechanical?** **Yes** — and `safety_check.py` additionally greps the staged diff for the literal
credential values, because a structural scanner can miss a plain password.

### 6 · Claiming a check that did not run
**What it costs him:** he repeats my claim, and it turns out nothing was checked.
**The guard:** Rule 82's second half — **never claim a scan that did not run.** When something could
not be completed, say so plainly with what was and was not done.
**Mechanical?** No. **Mine.** The honest version of this cost me a 1399-second LibreOffice timeout
that I reported as a timeout rather than a pass.

### 7 · Breaking real data on a live system
**What it costs him:** he authorised the access.
**The guard:** seeding is **find-or-create and measures before it creates**. Never `git add -A`.
Never delete a record we did not create. Production work is confined to the named test workplace, and
seeding the wrong shop is treated as a serious error, not a shrug — the engine refuses to fall back
to "the first workplace".
**Mechanical?** Mostly. The engine enforces it; the choice of environment and workplace is confirmed
with him at the gate.

### 8 · Handing testers data that does not exist
**What it costs him:** his testers raise bugs against a working feature, and the team's time is
wasted chasing them.
**The guard:** every term is **proven on the target environment** (process 6), identifiers are
re-read after every reseed (Rule 111), and where no term can be proven the case says *"find the data
first"* rather than naming something false.
**Mechanical?** **Yes** — the audit script checks every typed value against the live environment.

---

## The standing promise, in four lines

1. **I never report something as done that I have not seen happen.**
2. **I never write to TestRail or Jira without permission for that specific thing.**
3. **I say what I did NOT do, as plainly as what I did.**
4. **When I am wrong, I correct it in the open, with the date** — struck through, not quietly edited.

---

## 🔴 What this does NOT promise

I will still make mistakes. What this set changes is **which** mistakes are possible.

Guarded **mechanically** — hard to get wrong even if I am careless: the secret scan, union-only run
sync, terms proven against the live environment, seeding that measures before it creates, the
session recovery, the second pass.

Guarded **by procedure** — I follow it, and it is written down so he can check: per-ticket
permission, the admissibility gate before any defect, quoting the spec verbatim, the evidence legs.

Resting on **my judgement** — where he is still exposed: deciding a finding is real, deciding a case
is correct, deciding something is complete. **The only protection there is that I say exactly what I
measured and when, so he can check me rather than trust me.**

That is the honest shape of it. If he needs something currently in the third group moved into the
first, that is a real request and the answer is usually a script.

**Run the mechanical half:** `python3 build/testing-tools/safety_check.py --staged --run <run-id>`
