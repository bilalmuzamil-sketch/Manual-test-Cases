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

---

# A SECOND COLLISION, SAME DAY, SAME MECHANISM — the C30114 repair

## What happened

The **12 files** for the **C30114 zeros-row repair** were staged by this worker, which then hit
**`fatal: Unable to create '.git/index.lock': File exists`** — the sibling Report Suite ticket-reformat
worker was mid-commit. **The lock was NOT removed** (deleting another process's lock risks corrupting its
operation); this worker waited instead, and the lock cleared in **1 second**. By then the sibling's
un-scoped commit had already swept the index, so `git diff --cached --name-only` came back **empty** and
the work was already committed inside

**`33d13dab` — *"Report Suite tickets: Sales By Customer batch reformatted (7 tickets), all byte-verified"***

which mentions **neither C30114 nor SV-8991**.

**The lesson at the foot of the first collision note was followed and it still was not enough.** This
worker did stage-and-commit in one breath — a single `git add … && git commit` chain. It made no
difference: the sibling's commit landed **between the `add` and the `commit`**, in the window the index
lock itself created. **So the real mitigation is narrower than "one breath": on a shared branch there is
no way to protect the index, and a worker must expect its staged files to be committed by someone else and
verify afterwards rather than assume its own commit carried them.**

## Nothing was lost, and it was verified rather than assumed

All 12 files are in `33d13dab` and **`git status --porcelain` over both folders returns empty**, so HEAD is
byte-identical to the working tree. Two content spot-checks passed: `RECHECK-QUEUE.md` contains
`SECTION H`, and `execution-log.md` contains `30 fields compared, 0 mismatches`.

`build/report-suite/full-viu-2026-08-06/` — `execution-log.md` · `NO-SOURCE-DEFECTS.md` ·
`RECHECK-QUEUE.md`
`build/report-suite/zeros-row-2026-08-06/` — `testrail-execution-log.md` · `C30114-FIELD-COMPARE.json` ·
`evidence/sbc-v15-live-recheck-2026-08-06.txt` · `snapshots/c30114-pre-write.json` ·
`snapshots/c30114-post-write.json` · `snapshots/run359-PRE.json` · `snapshots/run359-POST.json` ·
`tools/write_c30114.py` · `tools/run359.py`

## What was deliberately NOT done

**History was not rewritten** — no amend, no rebase, no reset, no force push, for exactly the reasons
given for the first collision. **A misleading commit message is a documentation problem; a rewritten
shared history is a data-loss problem.**

## What a reader needs to know

If you are looking for where **C30114 was armed** — the false note removed, the `S18-N1` zeros assertion
restored, the Rule-61 three outcomes added, the marker set to
`AUTOMATION: READY - EXPECT FAIL (SV-8991)` and `refs` repinned to v15 — it is **`33d13dab`**, plus this
note's own commit. **The TestRail write itself is unaffected by any of this:** it was `update_case/30114`,
HTTP 200, 30 fields compared, 0 mismatches, and it is verifiable live regardless of which commit the
paperwork landed in.
