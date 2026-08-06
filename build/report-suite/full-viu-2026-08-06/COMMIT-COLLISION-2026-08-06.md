# A commit collision, recorded because the git log alone is misleading

## What happened

The nine Report Suite files for the "three decisions + ticket source block" pass were **staged** by
this worker and then **committed by the sibling Schedule worker** in commit
**`aa426e38`**, whose message reads *"Schedule VIU: readiness rebuilt, queue opened, resume and state
made exact"* and mentions no Report Suite work at all.

The sibling's commit was not path-scoped, so it swept the whole index — including my staged files —
into its own commit. When this worker then ran its own path-scoped `git commit`, git correctly
answered **"nothing to commit, working tree clean"**, because the work was already in.

## Nothing was lost, and this was verified rather than assumed

All nine files are present in `aa426e38` and **byte-identical to the working tree** (md5 compared file
by file):

`TICKET-SOURCE-BLOCK.md` · `FINDINGS.md` · `CHANGES-MADE.md` · `RESUME.md` · `verdicts.json` ·
`oplog-decisions.json` · `tools/decisions_2026-08-06.py` · `tools/widen_sv8937.py` ·
`evidence/jira-sv8937-widen-verify.json`

`aa426e38` was **already pushed** by the sibling worker, so the work is safe on the remote.

## What was deliberately NOT done

**History was not rewritten.** No amend, no rebase, no force push, no revert-and-recommit. The commit
is already on the remote and the sibling worker is live on the same branch; rewriting it would be
destructive and would collide again. **A misleading commit message is a documentation problem; a
rewritten shared history is a data-loss problem.** This note is the fix for the first, and it costs
nothing.

## What a reader needs to know

If you are looking for where the **ticket source-block rule** and the **three QA-lead decisions**
(C38918 → HOLD, SV-8937 widened, C30102's title) were committed, it is **`aa426e38`**, not any commit
whose message mentions Report Suite. The content is in this folder and in `FINDINGS.md` under
*"The QA lead's three decisions"*.

## The lesson, for both workers

A path-scoped `git commit -- <paths>` protects **what you commit**; it does not protect **your staged
files from someone else's un-scoped commit**. On a shared branch, **stage and commit in one breath** —
do not leave files sitting in the index while another worker is active.
