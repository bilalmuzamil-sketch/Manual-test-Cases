# Schedule follow-up push — findings, 2026-08-11

**Reconstructed after the fact.** The pass executed both its writes and died before writing
anything down. This file records what the two ops establish, and — as honestly — what
cannot now be recovered.

---

## F1 · The writes landed. That was the open question, and it is closed.

Both ops are **verified landed by CONTENT**, not by timestamp:

| Case | Intended | Live now | Verdict |
|---|---|---|---|
| **C29944** | remove expected item 3, renumber | the multi-status sentence is **gone**; old item 4 sits at 3 | ✅ **LANDED, correct** |
| **C38866** | provenance epic → owning stories, sentence 2 untouched | names **SV-8700** and **SV-8698**; build stamp `v3.5-7ec992f on 8/6/2026` **intact**; no `epic SV-8685` | ✅ **LANDED, correct** |

**Timestamps corroborate but were not the evidence:** 14:13:05Z and 14:13:08Z, inside this
pass's window, and nothing has touched either case since.

## F2 · A test that cannot be executed as written is worse than a missing test

C29944 asserted that **choosing more than one status shows all of them**, while its own
steps say **choose one**. A tester following the case could not have exercised item 3 at
all — so the only honest outcomes were to skip it silently or to invent a step. Both are
worse than the assertion not existing.

**And no source required it.** It was removed rather than reworded, which is the repair
Rules 25/57/58 mandate for an unsourced assertion. **The temptation this rule exists to
resist is real:** it would have been easy, and would have looked diligent, to open the
filter, tick two statuses, see what happened and write *that* down — and the case would
then have asserted the build instead of a requirement.

## F3 · A provenance line vaguer than the `refs` beside it undermines both

C38866's `refs` already named **two stories**; its provenance named only the **epic**. Rule
20 asks for per-story precision, but the sharper cost is credibility: a reviewer who
notices the two disagreeing has no way to tell which one the case is actually built on.
They now agree.

## F4 · What is NOT recoverable, and is therefore not claimed

**The executor's own run output is gone** — it wrote `ops.json` and `exec-log.txt` into
`/tmp/fu-push`, and `/tmp` did not survive. So the per-op *"30 fields compared, 0
mismatch"* lines it certainly printed **cannot be quoted**.

**What can be said, and its exact status:** `tr.update_case_verified` **raises** on any
mismatch and the executor has no exception handler, so completing both ops means the
comparisons passed. **That is an inference from control flow, not a quoted measurement**,
and it is labelled as one (Rule 12). The *outcome* — that the landed text is exactly what
was intended — **is** directly verified, field by field, and does not rest on the
inference.

**Practical lesson, and it is cheap to fix:** an executor should write its op log **into
the repository**, not into `/tmp`. Every one of today's passes that wrote to `/tmp` lost its
evidence; every one that wrote to the repo kept it. `/tmp` is for secrets only — it is the
one thing that must **not** be committed, and the one thing whose loss costs nothing.

## F5 · Which pass last wrote C38866 is not reconstructable — a reporting limit, not a data problem

C38866 appears in **both** the staged-push op list and this executor. TestRail exposes only
the most recent write, so the two cannot be separated. **Both ops landed and the final
content is correct**, which is what matters for the suite; the ordering is recorded as
unknown rather than guessed.

---

## OUTSTANDING — what is needed from the QA lead

1. **Run 357 is out of sync with its suite: 174 tests against 176 cases.** Missing are
   **C43588** and **C43589**, the two dark-mode cases created by the staged push. The run
   belongs to **Ayesha Khan** and now holds **529 graded results**, including **71 logged by
   Mudassir Qamar this afternoon**, so the write is yours to authorise (Rule 6). **It stays
   STAGED, not executed.** When it is run: **re-snapshot first** — any baseline written
   before Mudassir's grading is stale — and send the **FULL 176-case union**, because
   `update_run` *replaces* the selection and a partial list destroys tests **and their
   results**.
2. **Nothing else is outstanding on this pass.** Both writes are complete and verified;
   this paperwork was the only debt, and it is now paid.
