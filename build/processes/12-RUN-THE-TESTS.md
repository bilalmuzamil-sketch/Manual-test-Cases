# RUN THE TESTS `<feature> on <env>` — execute them and record honest results

> **Call it:** `RUN THE TESTS for Invoicing on staging`
>
> Writing a test and running it are different jobs. This one is about the discipline of the
> **verdict** — because a result that is not honest is worse than no result.

**RUNS AFTER:** `7 · Publish to TestRail` — it provides cases in a run, with proven terms.
**If it has not been done I run it**, rather than starting and failing halfway.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Which environment**, and a login for it | |
| **Which run** in TestRail to record against | |
| **Permission to write results** to TestRail | Rule 6 |
| Confirmation the data is seeded and the terms are proven | Otherwise failures will be data problems wearing a bug's clothes |

---

## THE HONEST-STATUS RULE

| Verdict | When |
|---|---|
| **Passed** | Observed, this run, with evidence captured |
| **Failed** | Observed to differ from the quoted expectation |
| **Blocked** | Could not be run — and it says **why**, specifically |
| **Not run** | Untouched. Never dressed up as anything else |

🔴 **Verified means OBSERVED, never inferred** (Rule 12). Nothing is marked from reasoning, from a
previous run, or from how it "must" behave. Anything not observed is **NOT VERIFIED** or
**Blocked-with-reason** — never filled in to make a report look complete.

**A tester marks anything that seems off as Blocked, never skips and never guesses.** Every Blocked
case gets a manual revisit against the current spec and build.

---

## THE STEPS

1. **Record the build marker first.** Every verdict is read against it (Rule 49 — a non-final build
   yields PROVISIONAL findings).
2. **Run the case exactly as written.** If the case cannot be followed, that is a finding about the
   case, not a licence to improvise.
3. **Capture evidence as you go**, not afterwards from memory.
4. **For each Failed or Blocked, write the plain "what needs to be done"** that a non-technical QA
   can act on. Never a bare status.
5. **Separate a product failure from a data or environment problem** before calling anything a bug.
6. **Re-test loop:** when a fix lands, re-run and re-stamp with the new build marker.

**On an EXPECT-FAIL case**, three outcomes and only three: exactly the stated symptom → mark Failed,
raise nothing new · fails **differently** → a NEW problem, report it · **passes** → the fix shipped,
tell the QA lead.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| A front-end block with a back-end allow | Reported as a bug | FE blocks + BE allows = **PASSED**, with the tester note (Rule 24). The inverse is a real defect |
| Marking from the ticket's status | "It's closed, so it must work" | Ticket status is never evidence about the build |
| A failure caused by a stale identifier | A false FAILED | Check the value exists on this environment first (Rule 111) |
| Results recorded against the wrong run | Lost work | Confirm the run id before the first write |

---

## DONE WHEN
Every case has an honest verdict with the build marker, every Failed/Blocked has plain next-step
wording, and the run reconciles — nothing silently "Not run" that was meant to be executed.

**Canonical:** `build/skills/09-TEST-EXECUTION.md`. **Rules:** 12, 24, 34, 47, 49, 61, 110.
**Worked example:** the three `BUILD-VERIFICATION-*.md` reports in `build/global-search/`.
