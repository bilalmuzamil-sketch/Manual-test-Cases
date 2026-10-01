# WRITE THE TESTS `<feature>` — author the suite from the quoted sentences

> **Call it:** `WRITE THE TESTS Invoicing`
>
> Turns the locked requirements into cases a manual tester can actually run.

**RUNS AFTER:** `3 · Lock the Requirements` — it provides the quoted sentences each case is built on.
**If it has not been done I run it**, rather than starting and failing halfway.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| The **locked requirements** (quoted sentences + citations) | A case with no source should not exist (Rule 64) |
| Whether the cases go in a **new TestRail section**, and which | |
| **Which run** they must join | Rule 34 — new cases must appear in the run |
| Any **existing suite** for this feature | So I extend it rather than duplicating it, and so I can spot contradictions |

---

## THE SHAPE OF EVERY CASE

- **Plain, layman English.** The build's exact on-screen labels, no jargon — no case ids, no spec
  anchors, no HTTP terms in anything a tester reads.
- Numbered **Preconditions / Steps / Expected**, each on its own line.
- **Expected Results = the quoted sentence**, marked as a quote, with document + version + section.
  Our plain-language restatement is **added after** it, clearly marked as ours, never replacing it.
- A **provenance line**, two sentences, never merged: sentence 1 names only documents; sentence 2
  optionally records the check (*"Last checked against build v3.5-16cf83f on 8/5/2026."*).
- An **automation marker**, last thing, exactly one of `AUTOMATION: READY` /
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` / `AUTOMATION: HOLD - <plain reason>`.
- A **title ≤ ~80 characters**, so nothing truncates on the case page.

---

## THE STEPS

1. **Group by what the user is trying to do**, not by how the code is organised. The Global Search
   integrity suite is organised by result-row behaviour per tab, because that is how a user meets it.
2. **Write the case from the quote.** If the quote does not decide the outcome, the case is HELD and
   becomes a PO question — it does not get a guessed expectation.
3. **Say what each case is worth.** A "why an end user cares" line keeps the suite honest and makes
   the ruthless-usefulness audit possible.
4. **Mark the cases that need data** so `Seed the Test Data` knows what to build. Be specific: not "a customer",
   but "a customer whose CITY carries the keyword and whose NAME does not".
5. **Run the usefulness audit** before anyone sees it (Rule 28), and ship the suite's
   **deliberate-decisions register** (Rule 46) so the choices are visible.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| A case whose matched value also appears elsewhere on the record | It passes without testing anything | Design for attribution: the keyword lives in ONE field (proof rules, leg a) |
| "For example, try X" | Somebody types X. If X does not exist, they file a bug against the product | Every named example is a promise. Prove it in `MAKE THE TESTS RUNNABLE` |
| Writing the expectation from the build | The case can never fail | Rule 113 — quote the source |
| A case nobody can run without hunting for data first | It gets skipped, or run badly | Either seed the data or say plainly in the preconditions what to look for |

---

## DONE WHEN
Every case has a source, a quoted expectation, a provenance line, an automation marker, and a plain
statement of the data it needs. Nothing claims a build check that has not happened.

**Canonical:** `build/skills/01-CASE-BUILD.md`, `build/skills/COVERAGE-MATRIX.md`.
**Rules:** 113, 64, 54, 61, 7, 9, 28, 46, 34.
