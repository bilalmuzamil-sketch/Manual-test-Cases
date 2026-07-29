# How Test Cases Are Created and Refined — A Process Clarification

*Prepared 2026-07-29 · A process clarification for the leadership team · Applies to every project and feature we test.*

---

## 1. Purpose — and the short answer

This document explains, end to end, how our test cases are created and how they are refined to be better at every stage: from the first written draft, through live verification on the real product, to ongoing execution by the QA team. It is a general description of the process itself — the same staged method is applied to every project and every feature.

**The short answer:** efficiency and accuracy are not hoped for at the end — they are engineered in through **staged quality gates** and **measured with real numbers**. Every test case passes a series of gates before a tester ever runs it, and the outcomes are audited across **100% of every suite — no sampling**. In a recent audit of one 500+ case suite, **97.9% of cases read correctly on a cold review** (a reviewer with no background picking the case up for the first time), and **under 0.5% were found invalid — caught by our own audit and removed before delivery**. Overlapping cases were consolidated by roughly ten percent, so testers only ever run work that matters.

| What is measured (recent full audit of one 500+ case suite) | Result |
|---|---|
| Cases that read correctly on a cold review | **97.9%** |
| Cases found invalid | **Under 0.5% — caught by our own audit and removed before delivery** |
| Overlapping work consolidated | **~10% merged, with nothing lost** |
| Cases checked | **100% — every case, one by one, no sampling** |

## 2. Where every test case comes from

Every test case is **born from a real requirement** — a line in the product specification, a design, or a ticket the development team is working on. Each case **carries its source on it**: a reference stating exactly which requirement and which ticket it exists for. This is **traceability** — the ability to take any case and answer "why does this exist, and why is this the expected result?" **A case that cannot say why it exists does not ship.** Unsourced cases are hunted down and either given their proof or retired, so 100% of the suite is provably genuine. No case is ever invented.

## 3. How cases are written

Accuracy of wording is never left to memory or guesswork:

- Every button name, screen name, and label in a test case uses the **exact words as they appear on the real product screens** — captured from the live application, never invented or paraphrased.
- Steps are **numbered and plain**, written so that any tester — including one running the feature for the first time — can execute them without asking a single question.
- Titles are **short and clear**, so a tester can tell at a glance what the case checks.
- **Nothing is ever guessed.** If a screen or label cannot yet be confirmed on the real product, the case is **flagged for confirmation** — it is never filled in with an invented word.

## 4. Quality gates before delivery

Before any suite is delivered, **every single case — 100%, never a sample — passes a three-dimension audit**:

| Dimension | What it checks |
|---|---|
| **Is it USEFUL?** | Would a failure of this case be a real bug worth raising? Is it checking something no other case already checks? Duplicates and filler are named and merged or removed. |
| **Does it MAKE SENSE?** | Read cold, by someone with no background: can the steps actually be done in order? Does the expected result logically follow? Does everything the case mentions actually exist in the product? |
| **Can ANY TESTER run it?** | Could a tester execute it easily on first contact and know exactly what "pass" looks like? |

Cases that fail any dimension are **fixed, merged, or removed BEFORE delivery** — never handed to a tester broken. On top of this, an **independent adversarial review** re-derives every judgement from scratch, straight from the source documents, and compares the result against the first pass; the suite ships only when the two agree. This is how the small number of invalid cases in the audit above were caught by us — not by anyone else.

## 5. The test-case lifecycle — a spec-based draft first, FINAL at live verification

A test case has two deliberate stages, and we are explicit and honest about which stage a case is in:

**Stage 1 — the spec-based draft.** The first version of every case is written from the **specifications** (and the designs or walkthrough videos, where they exist). It is the best possible paper version — fully traceable and quality-gated by everything above — but it is clearly marked as **"pending live verification"**. We never claim a case is final before the feature can be seen live.

**Stage 2 — FINAL at VIU.** **VIU means "Verify In UI"** — checking every case live on the real, running build, with evidence kept (screenshots or captured responses). Once a QA branch of the feature is available, the VIU pass reconciles the expected behaviors, the steps, and the wording with the actual environment. That is the moment the case is **locked as 100% accurate**.

VIU is not a single check — **two companion processes run with it**:

- **Build-accurate wording pass** — the exact words, button names, labels, and screen names are captured from the real product, and every case's title, steps, and expected results are corrected to match them **word-for-word**.
- **Spec-relevance reconciliation** — at the same time, the **whole suite** is re-checked against the **current specification** (not just the parts that changed): obsolete cases are retired, drifted cases are corrected, and any new gaps are filled — so the suite as a whole stays honest to the latest requirements.

**The takeaway: a test case has two lives — a spec-based draft that passes every paper quality gate, and a final, live-verified version whose every word has been checked against the real product.**

## 6. Keeping cases accurate as things change

Products change; the cases follow — immediately and completely:

- **Every specification change triggers a re-check of the WHOLE suite**, not just the parts the change mentions. A change in one place often quietly affects cases elsewhere; we look everywhere.
- **Ambiguity goes to the Product Owner, never to guesswork.** When a specification is unclear or two sources conflict, the Product Owner receives a simple plain-language question sheet (what happens now → the question → option A/B → their answer), and the cases are locked only on their **written answer**.
- **The newest ruling wins, and it is recorded.** When the specification, a ticket, a video, and a Product Owner message disagree, the most recent ruling is applied, and each case records which ruling it follows.
- **Every edit is backed up, approved, and logged.** Before anything changes, the original is saved; proposed changes go to the owner as a simple change-list first; only approved changes are made; each one is written with a per-case audit trail and **independently re-verified after writing**.

## 7. Manual QA takes the lead at the end

The process does not stop at delivery. During actual execution, the QA team owns a live feedback loop that keeps the suite honest:

- **If any test case seems off, confusing, or irrelevant during execution, the QA marks it Blocked** — never skips it, never guesses at what it meant.
- **Every Blocked case is manually revisited** — re-checked against the current specification and the live product.
- Cases found **completely irrelevant are removed** — and, because of all the gates described above, these are expected to be **no more than 1% of the suite**.
- Where only a **slight change** is needed — in the **expected behavior**, the **steps of reproduction**, or the **title** — **the QA owns that fix directly**: they edit and save the case themselves.
- If such an edit turns a case into a **duplicate** of another, the duplicate is **deleted**; if the edit creates a **new, unique test scenario**, the case is **retained**.

## 8. Execution discipline — and the QA's wider mission

This section reflects what was aligned with the QA team in the Daily QA Meetup of 2026-07-29.

**Running the test cases as written is one part of the job — and it is run as written.** Test cases cover the intended functionality of the feature. During a test-case run, the tester executes the cases exactly as they are, and uses the Blocked mechanism above for anything that seems off. Real-time improvisation is **not mixed into the test-case run** — that keeps the run's results clean, comparable, and trustworthy.

**Separately from test-case execution, QAs deep-dive each feature to try to break it.** Beyond the written cases, edge cases require **"creative, imaginative testing by QA to attempt to break the features"** (as briefed in the meetup) — deliberately probing beyond the standard requirements, and hunting for **regressions** (things that used to work but were broken by a newer change).

**Those findings are raised as TICKETS, not folded into the run.** When a tester successfully breaks a feature or finds a regression, they **create a ticket** for it — the meetup's standing action: *create tickets for any edge cases or scenarios that break features during manual creative testing*. The findings from this edge-case and exploratory work are consolidated into a **separate, dedicated section for regression and edge-case documentation**, kept apart from the standard feature cases.

**Those tickets later BECOME test cases.** Each edge-case or regression ticket is subsequently converted into a new, structured test case in that dedicated section — so the suite **continuously grows from real findings**, not just from specifications. Every genuine discovery made in the field is captured permanently and protected against ever regressing unnoticed again.

## 9. Other safeguards that run quietly in the background

- **Guard notes prevent false bugs:** where behavior looks wrong but is actually accepted by product policy, the case carries a plain **"this is expected — mark it passed, don't raise a bug"** note for the tester — saving developer time on non-bugs.
- **Deviations are always provable:** when the product behaves differently from a case, we never just say "mismatch" — we **quote the exact specification or ticket wording** the behavior deviates from. If the expectation turns out not to be in the specification at all, the case is corrected instead of a false bug being raised.
- **Execution is tiered for efficiency:** cases are split into the **regression core** (run every cycle) and **one-time acceptance checks** (run once) — so tester time goes where it protects the product most.
- **Fix verification with visual proof, on every environment:** when a bug fix is tested, it is verified with **before/after evidence** against the exact reported scenario — on the test environment AND again on the live product after release — and the evidence is posted on the ticket.
- **Suites ship with their numbers:** every delivered suite carries its measured quality tally (how many kept, merged, removed; how many read sensibly) — **quality is demonstrated, not asserted**.

## 10. The process in one paragraph

Every test case is sourced from a real requirement and carries that source on it; it is written in the exact words of the real product, in numbered steps any tester can run; 100% of every suite is audited on three dimensions — useful, makes sense, runnable — and independently re-reviewed before delivery; the first version is an honest spec-based draft, and the final version is locked only at live verification on the real build, where the wording pass and the whole-suite reconciliation run together; every later change is re-checked suite-wide, ruled by the Product Owner where ambiguous, backed up, approved, logged, and re-verified; at execution the QA team takes the lead — Blocked cases are revisited one by one, slight fixes are owned by the QA directly, and truly irrelevant cases stay under one percent; and in parallel with the disciplined test-case runs, the QAs creatively deep-dive each feature to break it, raise every such finding as a ticket, and those tickets are converted into new test cases — so the suite is not only accurate at delivery, but grows sharper with every real finding.
