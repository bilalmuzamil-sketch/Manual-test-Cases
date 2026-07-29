# How We Ensure Our Test Cases Are Good — The QA Quality Pipeline

> **What this is:** the presentable, plain-language explanation of the quality pipeline every
> test-case suite in this workspace goes through, from spec ingestion to post-delivery
> self-correction. This is the document the QA lead presents when asked *"what process do you
> use to ensure the test cases are good?"*. Each step ends with a pointer to the full internal
> process doc for readers who want the mechanics.

Every suite we deliver passes through **nine gates**. No suite skips a gate, and every gate
produces an artifact (a matrix, a tally, an audit log) so the quality is provable, not claimed.

## 1. Source ingestion — verbatim, complete, latest-wins

We start from the **complete, canonical sources**: the current spec (read verbatim from the
canonical Confluence page, never from a summary), every Jira story in the epic, the designs,
and any PO rulings. When sources conflict, the **most recent update wins** — we never let a
stale sentence from an older spec version survive into a test case. If any part of the input
set is missing, we stop and ask for it rather than guess.
*Internal reference: `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` + the per-project
`requirements.md` ingest conventions (Standing Rules 1/15/17/23).*

## 2. Traceability — no orphan cases, ever

Every single test case carries, in its TestRail **References** field, the **Jira ticket it
belongs to plus the exact spec section it derives from** — together, in one field. Anyone can
take any case and show *why it exists* and *why its expected result is what it is*. A case with
no ticket and no spec anchor is treated as not authentic: we hunt those down and backfill or
retire them, so 100% of the suite is provably sourced.
*Internal reference: `build/MISSING-TRACEABILITY-PROCESS.md` (Standing Rule 20).*

## 3. Build-accurate, plain wording — a new tester can run it cold

Titles, preconditions, steps, and expected results use the **exact words, button labels, and
screen names as they actually appear in the application** — captured from the live build, never
invented or paraphrased. The language is deliberately plain: a brand-new, non-technical manual
tester can execute any case without asking questions. If an on-screen label cannot be confirmed
from the build yet, we **flag it** for live confirmation — we never invent it.
**Lifecycle note:** the first version of every case is deliberately **spec-based and marked
"pending live verification"** — the best possible paper version (fully traceable, quality-gated),
never claimed final before the feature can be seen live. The FINAL version is locked at step 8
(VIU), when every word is checked against the real build.
*Internal reference: `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (Standing Rules 7/9).*

## 4. Coverage matrix — both directions, every requirement

For each project we maintain a **coverage matrix** mapping every spec requirement to the test
case IDs that cover it, and every test case back to the requirement it covers. This proves two
things at once: **nothing in the spec is untested** (no gaps), and **nothing in the suite is
unsourced** (no filler). Intentional exclusions (out-of-scope items) are listed explicitly with
the reason, never silently dropped.
*Internal reference: the per-project `coverage-*.md` matrices (Standing Rule 17).*

## 5. Adversarial review — we try to prove ourselves wrong before shipping

Before anything ships, we run an **adversarial self-audit**: judgements are independently
re-derived from a verbatim truth table built from the canonical spec (not from memory or a
prose summary), and the re-derivation is **diffed** against what was written. The suite ships
only when the diff is empty. For release-critical work this re-audit covers the full
population, not a sample.
*Internal reference: Standing Rule 15 (verbatim truth-table + adversarial self-audit).*

## 6. Ruthless Usefulness Audit — the three-dimension quality gate

Every authoring pass ends with a mandatory audit that scores **100% of the cases — no
sampling — on three dimensions together**:
- **Useful:** each case gets exactly one verdict — **KEEP / MERGE / WEAK-KEEP / CUT** — hunting
  the named "slop" patterns (near-duplicates, per-column explosions, filler) and crediting the
  load-bearing coverage (calculations, permissions, persistence, exports).
- **Makes sense:** each case is read cold, the way a critic would — **SENSIBLE / FIX-WORDING /
  NONSENSE** — against six concrete fail conditions (steps not executable in order, expected
  result doesn't follow, internal contradiction, phantom controls, domain nonsense, not
  actionable).
- **Genuine + layman-runnable:** each case is traceable to its ticket + spec (step 2) and
  executable by a non-technical tester (step 3); failures get fixed or cut.

The suite **ships with the tally** as proof, including an honest "is the critic right?" answer
with real numbers. Worked example: the Reports suite — **515 cases audited → a lean ~460
delivered**, with every merge and cut named and user-approved.
*Internal reference: `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` (Standing Rule 28); canonical
example `build/report-suite/quality-audit-2026-07-28/`.*

## 7. Spec-change reconciliation — the suite never drifts from the spec

Specs change; the suite follows. On **every spec update** we re-check the whole suite (not just
the named deltas) against the current spec plus all Done tickets, newest-wins. Full pre-edit
**backups** are taken, the proposed changes go to the user as a simple **change-list for
approval**, and every approved TestRail edit is executed with a **per-case audit log** and
re-verified after writing. Nothing is ever changed in TestRail without explicit authorization.
*Internal reference: `build/SPEC-RECHECK-PROCESS.md` +
`build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md` (Standing Rule 6).*

## 8. VIU — Verify In UI: every case proven against the real application

Every case is verified **LIVE on the actual build, with evidence** (screenshots / captured API
responses from that run). A result is only ever **observed, never inferred** — not from the
spec, not from source code, not from role definitions. Each case lands in one of three honest
states: **Verified** (observed working), **Deviation** (observed differing — with the exact
spec/ticket wording it deviates from cited verbatim), or **Blocked** (with the concrete reason
stated). If the required data state doesn't exist, we seed it ourselves and observe — a case is
never left unverified for lack of data.
**Lifecycle note:** VIU is where the spec-based draft (step 3) becomes the **FINAL version** —
wording, steps, and expected behaviors locked as 100% accurate. VIU is not a single check: two
companion processes run with it — the **build-accurate wording pass** (exact on-screen words
corrected into every case, word-for-word) and the **spec-relevance reconciliation** (the WHOLE
suite re-checked against the CURRENT spec: obsolete cases retired, drifted cases corrected, gaps
filled). So a test case has two lives: a spec-based draft that passes every paper quality gate,
and a final, live-verified version whose every word has been checked against the real product.
*Internal reference: `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` +
`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (Standing Rules 10/12/13/14/25).*

## 9. The final fool-proof loop — tester feedback via Blocked

The pipeline doesn't end at delivery. During execution, if a case seems **off, confusing, or
wrong** to the manual tester, they mark it **Blocked** — never skip it, never guess. **Every
Blocked case is then revisited manually**: re-checked against the current spec and the live
build, and fixed — reworded, expectation corrected, merged, or retired — with a logged TestRail
update. This closes the loop with the people actually running the cases, so the suite
**permanently self-corrects** in the field.

**Refinements (QA lead, 2026-07-29):**
- **≤1% expectation:** cases found COMPLETELY IRRELEVANT on revisit are removed — and, given the
  gates above, these should be **no more than 1% of the suite**.
- **QA owns slight fixes directly:** where only a SLIGHT change is needed — in the **expected
  behavior**, the **steps of reproduction**, or the **title** — **the QA owns that fix directly**
  and updates the case.
- **The QA deeper-dive duty:** it has been clarified to the QA team that working on the test
  cases is only ONE PART of making a feature squad successful — QAs also do a **DEEPER DIVE**
  into each feature, actively attempting to **BREAK it**, finding **REGRESSIONS**, and reporting
  them.
- **Findings become cases:** those edge-case tickets and regression tickets are later
  **CONVERTED INTO TEST CASES** too — so the suite continuously grows from real findings, not
  just from specs.

*This step is the QA lead's standing instruction (2026-07-29, verbatim): "the last fool proof
process is that the manual tester marks the test cases which seems off to him/her as Blocked
and we revisit those blocked tests manually to see what needs to be changed there." The
refinements above are the QA lead's 2026-07-29 follow-up instruction (as relayed): cases found
completely irrelevant are removed and "should be NO MORE THAN 1% of the suite"; where only a
slight change is needed "in the expected behavior, the steps of reproduction, or the title —
the QA owns that fix directly"; "working on the test cases is only ONE PART of making a feature
squad successful: QAs also do a DEEPER DIVE into each feature, actively attempting to BREAK it,
finding REGRESSIONS, and reporting them"; and "those edge-case tickets and regression tickets
are later CONVERTED INTO TEST CASES too."*
*Internal reference: the post-delivery loop section of
`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` (Standing Rule 6 governs the logged corrections).*

---

**The one-line answer:** *every case is sourced verbatim from the current spec and ticket,
traceable, written in the exact words of the real application, coverage-mapped both ways,
adversarially reviewed, audited for usefulness and sense across 100% of the suite, re-reconciled
on every spec change, proven live in the UI with evidence — and then kept honest forever by the
testers themselves through the Blocked-revisit loop.*
