# STEP 3 (remainder) — the different-reason tester notes · EXECUTED 2026-08-04

## STATUS: **EXECUTED** — 8 `update_case`, every one HTTP 200 and byte-verified, 0 collateral changes

The main part of Step 3 was already live before this session: **47 cases** carry the QA lead's
verbatim **DO NOT AUTOMATE YET** sentence with the decisions file **named as well as linked**, and I
verified all 47 independently — the provenance line is **last on every one of them** (commit
`3d6aabe`). This log covers the **remainder**: the cases whose hold has a **different reason**, which
had **not** been done.

---

## WHY THESE CASES NEEDED A DIFFERENT LINE

The DO-NOT-AUTOMATE line says *"waiting on an answer from the product owner"*. On these eight cases
that would be **false** — nothing about them is waiting on Chris Ward. Using the same sentence would
have pointed a tester at a question sheet that does not contain their answer.

| Group | Cases | The real reason | What the tester is told |
|---|---|---|---|
| **Nightly Work In Progress figures** | 4 | The values are written by an overnight background process and **no screen in this version reads them back** (`S11-R7`) | mark **BLOCKED**, not failed |
| **Retention / thinning** | 2 | Needs **more than 13 months** of history; this organisation holds about **five days** | mark **BLOCKED**, not failed |
| **The closed SV-8823 money format** | 1 | The QA lead **accepted** the behaviour | *known and accepted, do not re-report* |
| **The columns/order half** | 1 | Already written up, **decision pending** | record it, no need to raise it again |

---

## THE EIGHT OPERATIONS

| # | Case | Group | HTTP | Byte-verification | Collateral fields changed |
|---|---|---|---|---|---|
| 1 | WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | nightly | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 2 | WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | nightly | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 3 | WIP-API-04 = [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | nightly | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 4 | WIP-API-06 = [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | nightly | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 5 | IV-API-05 = [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | history | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 6 | IV-API-06 = [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | history | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 7 | IV-EXP-04 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | money-accepted | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |
| 8 | IV-EXP-03 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | columns-recorded | **200** | 30 fields compared, 1 intended, **0 mismatch** | **0** |

Only `custom_expected` was written. **Every other field was proven byte-identical to its pre-write
snapshot** — an explicit second check on top of the helper's own comparison (Rule 50). Snapshots:
`data/C<id>.before.json` / `data/C<id>.after.json`; per-op log `data/op-log.json`.

---

## THE COUNT IS 4, NOT 6 — and here is why

The brief said *"the 6 Work In Progress nightly-figure cases"*. The set is **WIP-API-01…06 =
C30528–C30533**, but **C30529 and C30532 were absorbed by the authorised merges** earlier today
(their content folded into C30528 and C30530 respectively, then deleted — Step 1 §3). **So the live
set is 4**, and stamping 6 was impossible. The two absorbed cases' assertions now live inside two of
the four that were stamped, so **the coverage is stamped even though the case count is lower.**

The same arithmetic applies to the Inventory Value API set: C30608 was absorbed into C30607, so
C30605–C30610 is **five** live cases, not six.

---

## THE ONE PLACE I DEPARTED FROM THE BRIEF — and why

The brief said to add the *"Known and accepted: the product behaves this way on purpose for now. Do
not raise this as a new problem."* line to **both C30588 and C30589**. **I applied the QA lead's
verbatim sentence to C30589 only, and gave C30588 a different, accurate line.** The reason is that
putting it on C30588 would have made our own suite contradict itself:

- **C30589** is the **money format**. The QA lead ruled on exactly this and closed SV-8823 — *"good
  to stay closed"*. It **is** known and accepted. His sentence is used verbatim.
- **C30588** expectation 1 is the **columns and order** half. **Step 2 of this same session
  recommends its own ticket for it** — so it is emphatically **not** accepted, and telling a tester
  *"the product behaves this way on purpose"* would (a) assert an intent I have not observed
  (Rule 12) and (b) instruct him not to raise something we are simultaneously asking to have raised
  (Rule 28's contradiction sweep would flag it, correctly).

C30588's line instead says the difference **is already written up and a decision is pending** — true,
non-committal about intent, and it still prevents the duplicate report the QA lead wanted prevented.
**If he wants the verbatim sentence on C30588 as well, that is a one-line change and his call.**

## THE OTHER PREMISE THAT DID NOT HOLD

The brief asked me to fold in *"C30589's **unsourced** no-thousands-separators assertion"*. **It is
not unsourced.** Step 2 §0 quotes the Inventory Value spec v3 Story 10 context note requiring exactly
that, *"so they parse cleanly in a spreadsheet"* — and C30589's own `refs` already carries the
`(+ context note)` hedge pointing at it. **So I did not soften a properly-sourced assertion.** I left
its text byte-identical and put the accepted-deviation note beneath it, which is the "move it behind
that note" branch the brief allowed and the only one that does not delete a real, sourced expectation.

---

## THE INVARIANTS, PROVEN RATHER THAN ASSERTED

Checked programmatically on all 8 before any write, and re-checked after:

- **Provenance stays LAST** — exactly one provenance line per case, and it is the last non-blank line.
- **No assertion altered** — every numbered line extracted before and after and compared; **byte-identical on all 8**.
- **DO NOT AUTOMATE stays immediately before provenance** — on C30588 (the only one of the 8 that carries it), the new note was inserted **above** the DO-NOT-AUTOMATE block so that block still sits immediately before the provenance line.
- **Idempotent** — re-running the stamper on its own output is a **no-op**, asserted in the planner. A re-stamp replaces; it never appends a second copy.
- **Live text == planned text** — each case's live `custom_expected` was compared to the text the plan was built against and the write **refuses** on any drift.

## Rule 41 — the whole-case re-read, logged per case

Every one of the 8 was re-read end to end before writing, not just the field being changed. Recorded
per case in `data/op-log.json`: title length, `refs` present, provenance present, **spec version
matching the generator's map**, precondition/step lengths, section and type. **Findings: none.** All
8 titles are within 80 characters (59–79), all carry `refs`, all carry a provenance line, and all
name the correct specification version (Work In Progress v6, Inventory Value v3).

## Run 359 and the foreign cases — verified after the writes

| Check | Result |
|---|---|
| `include_all` | still **false** |
| Tests | **469** — case-id set **equal both ways** to the pre-write set |
| Result records | **529** — **all 529 verified present BY ID**, 0 missing, **0 new** |
| Foreign C38919–C38923 | **byte-identical**, 0 diffs, including `updated_on` / `updated_by` |

`update_case` does not touch a run, and this proves it rather than assuming it.

---

## OUTSTANDING — what I need from you

1. **Do you want the verbatim *"Known and accepted"* sentence on [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) too?** I deliberately did not put it there (reason above). One-line change. **Blocked on: you.**
2. **[C30590](https://shopview.testrail.io/index.php?/cases/view/30590) still needs its correction** — the deploy added a `"Date Range:"` first line, so its *"the CSV's first line reads As of:"* note is now wrong. **Not written; outside my authorised write-steps. Blocked on: you.**
3. **The wording changes for the runnable nightly cases** — C30605, C30606 and C30607 can actually be run today through the as-of view but still read as blocked. Staged in `../nightly-cases-2026-08-04/TWELVE-CASES-EXPLAINED.md` Part 5, never authorised. **Blocked on: you.**

Nothing else is outstanding from this step.
