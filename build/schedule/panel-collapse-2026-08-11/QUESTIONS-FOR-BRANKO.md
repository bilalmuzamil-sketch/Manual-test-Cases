# Questions for Branko — Schedule, the panel-collapse button — 2026-08-11

**One question only.** §5.3 is unusually complete for a new section, and everything else in it was
authorable as written. **This is not a new question** — it was already drafted as item **S-2** of
`build/schedule/coverage-rederivation-2026-08-10/QUESTIONS-FOR-BRANKO.md` on 2026-08-10. It is
repeated here because it is now **cited on a live test case** and therefore has a concrete cost.

**Please add it to the 6 August sheet rather than send it separately** — that sheet already holds 20
items, 8 of them Schedule, and **it has still not been sent. The blocker is us, not Branko.**

---

## Q1 · SCHEDULE (the technician scheduling calendar) — the button that hides the job list

**Project:** Schedule · **Feature:** the calendar's left-hand job list and the button that hides it
**Story:** [SV-8686](https://shopview.atlassian.net/browse/SV-8686) *Schedule Grid Layout & Navigation*, under epic [SV-8685](https://shopview.atlassian.net/browse/SV-8685)

### What happens now

Your description of **7 August** adds a new button to the calendar that hides and shows the job list
down the left-hand side, giving its space to the calendar. About whether the calendar remembers that
choice, it says the setting lasts **only while you are signed in** — so if you hide the list, sign
out, and sign back in tomorrow, the list is showing again.

Separately, the **design review of 5 August** asks for the calendar's view settings to be
**remembered for each person even after they sign out and come back**.

Those two are different promises, and we do not want to guess which you meant.

### The question

When someone hides the job list and then signs out, what should they see the next time they sign in?

| | |
|---|---|
| **A** | The job list is **showing again**. Hiding it only lasts for the sign-in you are in. *(This is what your 7 August description says.)* |
| **B** | The job list is **still hidden**. The calendar remembers it for that person from one sign-in to the next. *(This is what the 5 August design review asks for.)* |

**Your answer:** ______________________________________________

---

## QA-only — not for the reader-facing sheet

| | |
|---|---|
| **Assertion at stake** | `§5.3-L195.A2` — *"Session-scoped per user for build — this is a working-mode preference, not a saved view."* |
| **Case affected** | **SCH-PANEL-06 = [C43587](https://shopview.testrail.io/index.php?/cases/view/43587)**, expected item 2 |
| **Conflicting source** | item **E12** of the Fabian / Sasha design review, 2026-08-05: *"persist view options per user … so it survives across sessions"* |
| **How the case is written meanwhile** | It **follows the specification** (answer A) and **states the open question in its own tester-facing text**, so a tester is never left guessing why it says what it says. The ambiguity was **not** resolved by looking at the build (Rule 58) — which would have been impossible anyway, since the control is not built |
| **If the answer is B** | Expected item 2 of C43587 is reversed, and the case gains a Rule-56 divergence sentence naming the answer, its date and what it supersedes. **One `update_case`.** |
| **If the answer is A** | The case is already correct; the open-question note is removed and replaced with a Rule-54 confirmation citing the answer. **One `update_case`.** |
| **Also unblocks** | item **B-5** of `build/handover-ingest-2026-08-10/QUESTIONS.md`, which asks the same thing about the *view options* rather than the panel — a different control, and the two answers may legitimately differ |
| **Related but NOT asked here** | Which design artefact is canonical for Schedule. That is Tab 2 Item 4.0 of the 6 August sheet and is already outstanding |

---

## What was deliberately NOT asked

**Recorded so a future pass does not re-ask (Rule 36's "never re-ask a question a source has
answered").**

| Considered | Why it is not a question |
|---|---|
| *"Secondary text color"* on the panel button | A design token, not a product decision. The case asserts its observable form and flags the softness. If a dated design ever arrives it resolves itself |
| *"Its divider disappears so no seam remains"* — when there is no divider element in the build today | The **outcome** is checkable either way (no leftover line or seam), so the case is written to that. Asking would spend the PO's attention on an implementation detail |
| Whether the panel button should exist at all, given it is not built | Not a product question — **the product decision was made on 7 August when it was written into the specification.** That it is absent from the build four days later is a **build gap for the QA lead and engineering**, not something to re-ask the PO |
