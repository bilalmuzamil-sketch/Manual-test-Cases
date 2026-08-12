# Filters — runnability, verify-final, 2026-08-12

> **⚠️ PARTIAL — THE RUNNABILITY WALK NEVER STARTED. This file states that plainly rather than
> leaving a gap that could read as a clean result.**

## THE HONEST NUMBER

**0 of 115 cases had their preconditions and steps walked on the build by this session.**

Not 0 found wanting — **0 examined**. No page of the application was opened; no harness was run. The
pass was stood down during orientation, and the QA lead's priority — *"the preconditions should be
learned from the sources and verified on Build to see if that is really possible to set as a
precondition on the build or not"* — is entirely un-started.

| The five checks, per case | Cases checked |
|---|---|
| 1 · Is the precondition reachable? | **0** |
| 2 · Does the navigation path exist? | **0** |
| 3 · Does each control exist where the step says it is? | **0** |
| 4 · Do the steps work in the order written? | **0** |
| 5 · Are the labels the ones on screen? | **0** |

## WHAT IS KNOWN ABOUT THE WORKLOAD, FROM SOURCES RATHER THAN FROM THE BUILD

Established live from TestRail this session, and it does narrow the job usefully:

| | cases |
|---|---|
| Runnable (`READY` + `READY - EXPECT FAIL`) | **97** |
| Held (`AUTOMATION: HOLD`) | **18** |
| **Of the runnable, still Untested in run 352** | **29** |
| Of the held, still Untested | **14** |

**So the walk should start with the 29 untested runnable cases** — they are the ones a tester will
open tomorrow with no prior result to fall back on. The list is committed at
`build/filters/build-viu-2026-08-12/SKIP-LIST.md` under *"DO run these 29"*.

**The other 68 runnable cases already carry a result**, which is not the same as their steps being
runnable today — a result graded on 5 August was graded against `v3.4.2-d00239b`, and the build has
moved a whole minor version since.

## THE ONE RUNNABILITY DEFECT ALREADY KNOWN, AND STILL OWED

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** names roughly 42 surfaces, of
which **two are known wrong** — `IBS Batch Transactions` where the build reads **`IBS Batches`**, and
`Sales Tax Invoices` where it reads **`Sales Tax Collected`**. Two prior passes deliberately declined
to correct two names inside a list of forty; the reasoning and the fix are in `DIVERGENCES.md`.

## HOW THE NEXT PASS SHOULD RUN IT

The method, the two categories and the recognition test are set out in `RESUME.md` step 4 and
`DIVERGENCES.md`. The two things worth repeating here because they are what protect the QA lead:

- **A precondition that genuinely cannot be reached gets `AUTOMATION: HOLD` with a plain reason and
  a "mark BLOCKED, not failed" line — never a silent pass.**
- **A precondition the sources require but the build cannot achieve is usually evidence the BUILD is
  wrong, not the case.** Rewriting it deletes the finding.
