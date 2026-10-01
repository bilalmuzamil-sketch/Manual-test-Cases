# FIND WHAT WE MISSED `<feature>` — look at the suite from outside before calling it finished

> **Call it:** `FIND WHAT WE MISSED in Invoicing`
>
> A suite built from a spec covers the spec. It does not cover what the spec forgot, what the user
> does anyway, or what the old version could do and nobody wrote down. **This is the deliberate look
> from outside, before anyone is told the suite is current.**

**RUNS AFTER:** `4 · Write the Tests` — it provides a suite to audit.
**If it has not been done I run it**, rather than starting and failing halfway.

**SAFETY:** this process obeys [what must never happen](00-WHAT-MUST-NEVER-HAPPEN.md), and may not report success while any check there
is unmet. Mechanical half: `python3 build/testing-tools/safety_check.py --staged`.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| The suite, and the sources it was built from | To compare one against the other |
| **The V1 baseline**, if this is a V2 | The largest gap on an upgrade is always invariants nobody wrote a case for |
| Any **real user complaints** or support tickets | They are the outside view, free |
| Permission to spend the time | It is a deliberate pass, not a by-product |

---

## THE FOUR ANGLES

### 1 — Requirement by requirement
Every requirement in the source gets a **verdict**, not a narrative: covered by case X / partially
covered, here is the shortfall / not covered. A summary paragraph is not a coverage answer (Rule 43).

### 2 — The invariant angle (a V2 only)
Everything V1 could do that V2's spec does not mention. **Silence defaults to "must not change"** —
so every invariant either has a case or an explicit decision not to test it.

### 3 — The user's angle
What would a real person do that nobody specified? Type a phone number with brackets. Paste a value
with a trailing space. Search a record they cannot access. Use a name with an apostrophe. These are
where suites are thin and where complaints come from.

### 4 — The other-author angle
Cases written by someone else that **contradict** ours are a **bug report against our suite until
disproven** (Rule 44). Establish both sides' sources and reconcile. Foreign cases are hands-off:
report, never edit — and state both numbers, ours N / live total M (Rule 38).

---

## THE STEPS

1. Build the matrix: every requirement against every case, with a per-requirement verdict.
2. Add the invariants, if there is a V1.
3. Walk the user's angle deliberately — not "can I think of anything", but a written list of input
   shapes, permission states, and edge values.
4. Diff against any other suite covering the same feature.
5. **Report the gaps as gaps.** A named gap is manageable; an unnamed one is a surprise in UAT.
6. Ship the **deliberate-decisions register** (Rule 46): what we chose not to cover, and why.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| A narrative instead of verdicts | "Coverage is good" | One verdict per requirement (43) |
| Counting cases as coverage | 111 cases, a whole area untested | Coverage is per requirement, not per case |
| Skipping the invariants on a V2 | Everything passes while a capability is gone | Angle 2 |
| Dismissing a contradicting case | Our gap stays hidden | It is a bug report against us until disproven (44) |
| An absolute claim | "All eight tabs covered" ages badly | No absolute enumerations without a version-pinned anchor (42) |

---

## DONE WHEN
Every requirement has a verdict, every invariant has a case or a decision, the user-angle list has
been walked, contradictions are reconciled, and the deliberate-decisions register ships with it.

**Canonical:** `build/skills/COVERAGE-MATRIX.md`, `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`.
**Rules:** 45, 43, 46, 44, 38, 42, 96. **Worked examples:**
`build/global-search/coverage-matrix.md`, `v1-coverage-audit-2026-09-10/`,
`scenario-coverage-2026-09-15/`.
