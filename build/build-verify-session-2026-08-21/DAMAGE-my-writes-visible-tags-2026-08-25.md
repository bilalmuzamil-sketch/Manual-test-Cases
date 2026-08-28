# 🔴 DAMAGE REPORT — 5 CASES I WROTE ARE SHOWING LITERAL HTML TAGS TO TESTERS

**Found 2026-08-25 by applying the QA lead's standing instruction to search the CANONICAL branch
before concluding anything.** I had been about to tell him this check needed Playwright and a MITM
bridge. **It does not** — a sibling session had already written the scanner, and it needs only a form
login. That search is the only reason this was found at all.

## WHAT IS WRONG, AND FOR WHOM

TestRail renders each text field into one of two containers, and **`get_case` does not expose which**:

| Container on the served view page | Behaviour |
|---|---|
| `<div class="markdown fr-view">` | value emitted RAW — HTML renders — **harmless** |
| `<div class="markdown">` | value run through the markdown renderer, which **ESCAPES every tag** — **the tester literally reads `<p>` and `</p>`** |

**Five cases I wrote on 2026-08-25 sit in the escaping container and now display tag text.**

| Case | Project · run | Tags the tester literally reads |
|---|---|---|
| [C44874](https://shopview.testrail.io/index.php?/cases/view/44874) | Global Search V2 · **R415** | `<p>` `</p>` `<ol>` `<li>` `<hr>` |
| [C44875](https://shopview.testrail.io/index.php?/cases/view/44875) | Global Search V2 · **R415** | `<p>` `</p>` `<ol>` `<li>` `<hr>` |
| [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) | Inline Add and Edit Parts · **R418** | `<p>` `</p>` `<br>` |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | Inline Add and Edit Parts · **R418** | `<p>` `</p>` `<br>` |
| [C45066](https://shopview.testrail.io/index.php?/cases/view/45066) | Inline Add and Edit Parts · **R418** | `<p>` `</p>` `<br>` |

**Those runs are assigned and live** — R415 to Bilal, R418 to Viktoria (commits `fe2294d0`, `56969478`).

## CAUSATION — PROVEN FROM MY OWN PRE-WRITE SNAPSHOTS, NOT ASSUMED

Every one of the five was **plain text with NO html tag in any field** before I wrote to it:

```
C44874: pre-write tags = NONE (plain text)      C45055: pre-write tags = NONE (plain text)
C44875: pre-write tags = NONE (plain text)      C45066: pre-write tags = NONE (plain text)
C45032: pre-write tags = NONE (plain text)
```

**My writes put the tags there.** I added `<br>` deliberately (to pre-empt the collapse) and TestRail
added `<p>` wrappers; on an escaping case both become visible text. **The `<br>` I added "to protect
the tester" is part of what the tester is now reading.**

## THE FULL TALLY OF MY 8 WRITTEN CASES

| Verdict | Cases |
|---|---|
| **DAMAGED — tag text visible** | C44874 · C44875 · C45032 · C45055 · C45066 |
| **SAFE — `fr-view` containers** | C44506 · C44864 |
| **No tag text visible; different template, no markdown container at all** | C44892 |

*(Correction owed: I have twice said "9 distinct cases". It is **8** — 12 `update_case` calls over 8
cases. C44864 ×3, C44506 ×3, and six others once each.)*

## THE CONTROL, AND WHY ITS FAILURE IS NOT A PROBLEM

The scan ran two controls so a negative could be trusted (skill `03` §2 — a probe that cannot fire is
not a check). **C30518, expected DAMAGED, came back clean** — which looks like a broken detector.
**It is not:** `a3faa928` (*"TestRail 2026-08-28: C30518 repaired + re-pinned"*) shows another session
**already repaired it**. The control expectation was stale, not the detector. **And the detector
demonstrably fires — it fired on five of my own cases.** So the negatives above are meaningful.

## THE REPAIR ROUTE EXISTS AND IS PROVEN — BUT IT IS A WRITE

**The API cannot fix this.** On an escaping case *every possible API value* puts visible tag text on
screen — the wrapper is re-added and any HTML written instead is escaped by the same renderer.

**The proven route is the TestRail web editor driven by Playwright over the local MITM bridge**, and a
sibling session has already run it at scale: **71 of 72 cases repaired and verified**
(`build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`, commits `2dfa8c08`, `362f17c5`).

**Not attempted — it is 5 writes and needs the QA lead's go-ahead** (Rule 6; and his standing
instruction: *"do not CRUD any test cases in testrail without my permission"*).

## WHAT I SHOULD HAVE DONE, RECORDED SO IT IS NOT REPEATED

The pre-write gate was already written down on 2026-08-26: **fetch `index.php?/cases/view/<id>` on a
logged-in session and read the container BEFORE any text write — `fr-view` safe, plain `markdown` do
not write.** I did not check it, because I did not search the canonical branch before writing. **The
knowledge existed; I did not go and get it.**

**⇒ AND THE DEEPER ONE: the `<br>` guard I invented was a fix for a defect that did not exist.** The
collapse census (v2) found **0** genuinely collapsed cases. So on these five I added markup to solve
a non-problem, and on an escaping container that markup became the problem. **A speculative fix is
not free — it is a write, and a write is the only thing that can damage a case.**

## OUTSTANDING

| What | Who | Blocks |
|---|---|---|
| **Go-ahead to repair the 5 via the proven UI route** | QA lead | Testers on R415 / R418 read tag text until then |
| Whether to warn the two assigned testers in the meantime | QA lead | — |
