# How We Ensure Our Test Cases Are Good — The QA Quality Pipeline

> **What this is:** the presentable, plain-language explanation of the quality pipeline every
> test-case suite in this workspace goes through, from spec ingestion to post-delivery
> self-correction. This is the document the QA lead presents when asked *"what process do you
> use to ensure the test cases are good?"*. Each step ends with a pointer to the full internal
> process doc for readers who want the mechanics.

Every suite we deliver passes through **ten gates**. No suite skips a gate, and every gate
produces an artifact (a matrix, a tally, an audit log) so the quality is provable, not claimed.

## 1. Source ingestion — verbatim, complete, latest-wins

We start from the **complete, canonical sources**: the current spec (read verbatim from the
canonical Confluence page, never from a summary), every Jira story in the epic, the designs,
and any PO rulings. When sources conflict, the **most recent update wins** — we never let a
stale sentence from an older spec version survive into a test case. If any part of the input
set is missing, we stop and ask for it rather than guess. **Before we touch a single test case we
re-check that we are holding the latest requirements, the latest tickets and the latest designs —
and we write down exactly which versions we checked, and when.**
*Internal reference: `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` + the per-project
`requirements.md` ingest conventions (Standing Rules 1/15/17/23/31).*

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

**Added 31 July: we now check every SURFACE a requirement touches, not only the place we first
noticed it.** A requirement rarely lives on one screen — the same rule usually has to hold on the
screen, in the PDF, in the spreadsheet download, in the printout, on mobile and in the data the
system returns. So each requirement is now signed off **surface by surface**, and the matrix shows a
verdict for every one of them rather than a single tick. The matrix is also **rebuilt from scratch
whenever the spec changes**, instead of being patched, so last month's blind spots cannot be
inherited. And when a requirement is added or changed, **every requirement in that change gets its
own line with its own decision** — covered by these cases, this case extended, a new case written, or
not testable and why. A written summary is no longer accepted in place of that line-by-line sign-off.
*Internal reference: the per-project `coverage-*.md` matrices (Standing Rules 17, 40, 43).*

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
  NONSENSE** — against seven concrete fail conditions (steps not executable in order, expected
  result doesn't follow, internal contradiction, phantom controls, domain nonsense, not
  actionable, and — added 31 July — **a "these are exactly the columns" style list that is not tied
  to the spec rule and version that can change it**, because such a list quietly turns a correct
  product into a failed test the moment a column is added). We also check the cases **against each
  other, not just individually**, so that no two tests can contradict each other about the same
  button, field or screen — and no case's title can say one thing while its expected result says
  another. **The same sweep now also confirms that a requirement is covered on every screen and in
  every download it affects** — not just where we first noticed it.
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

**Added 31 July: whenever we open a test case — for any reason at all, even to correct a single
word — we now re-read the whole case against the current specification before saving it, and record
that we did.** Opening a case is the cheapest opportunity we get to notice that something else in it
has gone out of date, and a small edit that ignores the rest of the case also leaves it looking
freshly reviewed when it is not.
*Internal reference: `build/SPEC-RECHECK-PROCESS.md` +
`build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md` (Standing Rules 6, 41).*

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

**Execution discipline (Daily QA Meetup, 2026-07-29 — source:
`build/meetings/Daily-QA-Meetup-2026-07-29-notes.md`):**
- **Don't mix the two modes.** Running the test cases as written is ONE part of the job;
  creative break-the-feature testing is done SEPARATELY from the test-case run — never
  improvised into it — so run results stay clean and comparable. Per the meeting notes:
  "while test cases cover intended feature functionality, edge cases require creative,
  imaginative testing by QA to attempt to break the features."
- **Findings go to TICKETS, not into the run.** "When testers successfully break a feature,
  they should report it via a new ticket" — the standing action item: "Create tickets for
  any edge cases or scenarios that break features during manual creative testing."
- **Tickets become future test cases.** Per the aligned decision: "Findings from edge case
  and exploratory testing will be consolidated into a separate, dedicated section
  specifically for regression and edge case documentation" — each such ticket is later
  converted into a structured test case there, so the suite grows from real findings.
- **Blocked/edit/delete protocol (same meeting):** irrelevant case → mark Blocked; minor
  conflict (button placement, expected-behavior discrepancy) → the tester edits and saves it;
  if the edit makes it a duplicate → delete; if it makes a new unique scenario → retain.

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

## 10. The outside-in check — we check our tests against what other people have written

**We now check our tests against what other people have written, in both directions.** Until
recently we only asked *"has somebody duplicated one of our tests?"* — a tidiness question. We now
also ask the question that actually protects coverage: **"has somebody written a test for something
we have no test for at all?"** If a colleague's test asserts something ours never mentions, that is
treated as a **signal that we may be missing a test**, not as a nuisance — and it is checked, with a
read-only script, before we call a suite finished.

Three more habits sit alongside it, and all four run before delivery, not after somebody complains:

- **We ask what an automation engineer would see.** Automation is written against the **running
  product**, so an automation engineer cannot describe a screen he has not seen. We deliberately
  take that point of view for each requirement — *"if I were automating this from the live product,
  what would I check?"* — and confirm we have a test for it. **Honestly stated: while we have no
  test environment of our own for a project, this can only reach as far as the written
  specification** — which is one of the reasons a test environment is on our list of asks.
- **We play the hostile reviewer against ourselves.** Before delivery we ask *"what would a critic
  say is missing?"* and answer it in writing, rather than waiting to be asked in public.
- **Every outside signal counts as coverage information, not just a message to answer.** A review, a
  colleague's test, a support ticket, a developer's comment, a customer complaint — each one is
  written down and compared against the suite. On one day in July, two reviews and one colleague's
  test each revealed something real; simply replying to them would have corrected three sentences
  and left the actual problems in place.
- **And a "we already cover that" answer must now show its working.** Saying *"that is covered by
  test 30277"* is not accepted on its own, because nobody can check it without redoing the work. The
  requirement's own words and the test's own words must be put **side by side** — and where one
  requirement demands **two** things, each gets its **own** line. This is the specific check that a
  real miss slipped through: a requirement asked for a column **and** a heading line in the
  downloads, we confirmed the heading line, and recorded the whole requirement as covered.

*Why this exists, plainly: an outside automation engineer once found a genuine gap in our tests
before we did — across five reports. He was right, we were wrong against our own specification, and
we had no process that would have told us he could see something we could not. That process now
exists.*
*Internal reference: Standing Rule 45; `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`.*

## 11. We write down our deliberate decisions before anyone challenges them

**Every suite ships with a register of the decisions we made on purpose.** Where we chose not to
write a test, where we followed the product owner's ruling instead of the wording in his own
document, where something is on hold awaiting an answer, and where we have accepted a known
imperfection — each is written down with **the evidence, the tests affected, who can close it, an
honest risk rating, and a single plain sentence anyone can read out in a meeting.**

The reason is simple and slightly uncomfortable: **a deliberate decision that nobody wrote down
looks exactly like a mistake.** On the day an outside engineer found a real gap, our own document
had recorded a nearby judgement in the confident language of a considered decision — and that one
was an error. Nothing in the document let a reader tell the two apart. Writing decisions down in
advance, with their evidence, means the QA lead is never surprised in a public channel by something
we chose on purpose, and a genuine mistake stands out instead of hiding among the deliberate ones.

**We never back-date a mistake into this register as though it had been a decision** — that single
temptation would make the whole register worthless.

*Internal reference: Standing Rule 46;
`build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md`.*

## 12. Every status report ends with what we are waiting on

**Every project status report ends with a plain list of what we are still waiting on and who owes
it — the missing specs, epics and designs, the unanswered PO and developer questions, the
authorizations we need, and the test environments we do not yet have — because unresolved inputs
are the main threat to test authenticity.** A case cannot cite a ticket that does not exist, cannot
assert a behaviour nobody has ruled on, and cannot be proven against a build we cannot log in to.
Naming these openly in every report is how they get closed instead of quietly accumulating. The
single cross-project list is kept in `build/OUTSTANDING-ITEMS-REGISTER.md`, updated the moment an
item is raised or cleared; an item is only removed when it is genuinely satisfied.

**And when the thing we are waiting on is a decision the QA lead himself has already made, we say
which decision, quote his exact words, date it, name the test cases it holds up, and say plainly why
it was the right call — so he can re-read his own reasoning without reconstructing it, and so a
deliberate pause is never mistaken for work we forgot to do.**

*Internal reference: Standing Rule 36 (and the six categories it mandates sweeping); Standing Rule
48 (the five things every QA-lead-blocked item must state).*

---

**The one-line answer:** *every case is sourced verbatim from the current spec and ticket,
traceable, written in the exact words of the real application, coverage-mapped both ways,
adversarially reviewed, audited for usefulness and sense across 100% of the suite, re-reconciled
on every spec change, proven live in the UI with evidence — and then kept honest forever by the
testers themselves through the Blocked-revisit loop, with every report stating openly what we are
still waiting on and who owes it.*
