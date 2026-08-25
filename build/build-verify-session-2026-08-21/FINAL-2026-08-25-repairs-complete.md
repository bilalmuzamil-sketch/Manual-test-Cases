# FINAL REPORT — the authorised repairs, 2026-08-25

Build-verification lane · branch `claude/slack-session-0sxnd9` · TestRail live.

## WHAT WAS WRITTEN — 6 cases, every write byte/render-verified

| Case | What changed | Checks |
|---|---|---|
| [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) | title repaired earlier; then **refs + expected**: `[query]` restored, literal backslashes removed | 12 PASS |
| [C44875](https://shopview.testrail.io/index.php?/cases/view/44875) | preconds + expected: `[q]` restored | 12 PASS |
| [C44892](https://shopview.testrail.io/index.php?/cases/view/44892) | steps: `[that customer]` restored | 12 PASS |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | expected: `[typed text]` restored | 12 PASS |
| [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) | title → `… (Tech View)` | 12 PASS |
| [C45066](https://shopview.testrail.io/index.php?/cases/view/45066) | title → `… (Full View)` | 12 PASS |

**FINAL SWEEP OVER ALL 428 LIVE CASES:** 0 genuinely collapsed · **0 swallowed-placeholder
signatures** · 1 literal-backslash case remaining (C44874, see below). **No marker date moved on any
case** — these were text repairs, not verification, and no build was checked.

## 🔴 TWO CORRECTIONS I OWE, BOTH AGAINST MY OWN EARLIER REPORTING

### (1) "16 of 428 collapse into one run-on paragraph" WAS WRONG. The real number is ZERO.

My detector flagged any field holding `<p>` + a newline + no `<br>`. **That is the NORMAL shape the CSV
import produces** — a field of block elements (`<ol><li>…</ol>`, `<hr />`, `<p>…</p>`) separated by
newlines, where the newlines are insignificant whitespace between blocks and the field renders
correctly. The correct test is far narrower: **a single `<p>` whose own inner text carries a newline.**
Re-derived across all 428 with the corrected test — evidence `evidence/collapse-census-v2.json` —
**0 genuinely collapsed cases.**

**So approved item 2 had nothing to repair, and I abandoned it** rather than execute 16 harmful writes.
**The real finding is the opposite shape and it is forward-looking:** **411 of 428 cases are plain
multi-line text** that renders fine today and **will be `<p>`-wrapped-and-collapsed by the next write**
to them. That is a write-time obligation, now recorded as core §2.1a, not a backlog of repairs.

### (2) I DAMAGED C44506 ACTING ON THAT FAULTY DETECTOR, AND IT CANNOT BE FULLY UNDONE

[C44506](https://shopview.testrail.io/index.php?/cases/view/44506)'s expected results were correct
block HTML. My write inserted `<br>` throughout, TestRail re-parsed it, and `</ol>` was relocated to
the end — so the provenance and marker paragraphs now sit **inside the ordered list**.

**Three writes attempted to restore it:** the original bytes verbatim, then the blocks made contiguous
with no newlines between them. **Both were re-parsed identically.** `update_case` cannot reproduce what
the CSV import created. **I stopped after the second attempt** — every further write is another roll of
the same dice.

**Where it stands: the words are correct and render correctly** (verified: rendered text identical to
the pre-damage original, one provenance, one marker, date untouched, `atmstatus` and section unchanged).
**What is lost is HTML structure, not content** — a tester sees the same sentences, with the provenance
block indented under the list instead of below it. **Reported rather than tidied away.**

**The transferable rule, now in playbook §J as DECLARED NORMALISATION #3a:** an import-created case
holds clean block HTML that `update_case` cannot reproduce, so **never write to a case unless the write
fixes something a tester can actually see.** A speculative "tidy" write is a permanent structural cost
for no gain.

## NEWLY PROVEN NORMALISATIONS — recorded BEFORE being relied on (Rule 50)

Recorded in `build/APP-ACTIONS-PLAYBOOK.md` §J as **#3a-i / #3a-ii / #3a-iii**, and they falsify the
"a field sent explicitly is stored verbatim" half of the existing #3:

1. **plain multi-line text → `<p>`-wrapped with bare newlines** (the collapse) — C44864.
2. **`—` → `&mdash;`** entity encoding; renders identically — C44506.
3. **block markup re-parsed, a list's closing tag relocated to the end of the field** — C44506, not
   recoverable.

Verification in this pass therefore compares **RENDERED** text — tags stripped, entities decoded,
whitespace collapsed — and reports byte-equality without gating on it, because TestRail's own pipeline
makes byte-equality unattainable.

## ONE NEW FINDING, NOT WRITTEN — [C44874](https://shopview.testrail.io/index.php?/cases/view/44874)

Its expected results read `'Showing 12 work orders matching \'Fib\''` — **literal backslashes**, the
same defect class as C44864's. **But this one is in OUR LOCAL SOURCE too** (`GS-LIST-01`), so it is an
**authoring defect faithfully carried into TestRail**, not an import artefact.

**Not touched — it was not in the approved list, and permission is per ask.** Recommended fix, in both
the local source and the live case: `'Showing 12 work orders matching "Fib"'`.

## ITEM 2's CASES, AND THE INVOICE REFRESH PAIR

Neither is outstanding work any more: **item 2 is void** (0 collapsed cases), which also disposes of
C44901 and C44908 — the two I had held back over the stale foreign lock. **There was nothing to repair
on them either.** The lock question is now moot for this batch.

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** All six written cases are `custom_atmstatus = 1`, read live at write time. Zero Automated
cases exist across the six groups.

## WRITES — COMPLETE LIST FOR THIS SESSION

**11 `update_case` calls, all on 8 distinct cases, all authorised:**
C44864 ×3 (title, break repair, placeholder finish) · C44506 ×3 (the faulty write and two restore
attempts) · C44875 · C44892 · C45032 · C45055 · C45066.
**No `add_case`. No `delete_case`. No run write. No result write. No Jira ticket. No foreign case
touched.**
