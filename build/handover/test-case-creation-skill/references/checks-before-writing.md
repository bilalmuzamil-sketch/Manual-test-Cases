# Checks before writing

## 1. Before any write to TestRail

Run these by script over every case, fix every finding, then read cases yourself.

**Format and wording**
- Title at most 80 characters, no semicolons; design titles start with `Design: `.
- Number of steps equals number of `Step N:` blocks; no step does two UI actions.
- No text points at a step number the case does not have.
- Exactly one automation line, and it is last.
- No placeholders in braces, no "For example:" lines, no "mark this test Blocked" line, no "ask your QA lead".
- No case ids, ticket ids, requirement codes, HTTP terms or internal names in the tester-facing parts (title,
  preconditions, steps, plain results). They belong only in the quotes, refs and references blocks.
- No vague look words ("native", "as described", "same style", "as in the layout") without the concrete fact.
- No "as before", "as today" or "unchanged" without a baseline the tester can see in the case.
- Special characters survive the write (for example, send a check mark as `&#10003;`, not a raw ✓).

**Sources**
- Every quote is word for word in the current version of its source (strip HTML and compare by script).
- Every quoted message-table row matches its source row, fixed words exact.
- Every requirement has a verdict; every case has a source.
- Every ticket under the epic has a verdict.

**Runnability and independence**
- Every record named in the preconditions is used in the steps or results, or says why it is needed.
- Records the case changes are created fresh for it; nothing relies on another case.
- No case a tester cannot set up is in the manual suite.
- Every "does not appear / nothing happens" result has a visible control.

**Then read**
- A random sample of cases, in full.
- Every "does not appear / never" result, in full.
- Any case flagged by the checks.

**During and after the write**
- Re-read each live case before updating it, and skip (and report) any case someone else changed since your last read.
- Read every case back after writing and compare field by field.
- Log every write: operation, case id, HTTP status, read-back result.
- Run the suite's checks again after the write; a check that compares draft and read-back must treat both sides alike.

## 2. Before sending any question to the product owner

A question costs the product owner's time. Send it only if it passes all eight checks; record which check it passed.

a. **Precedence.** Read the PRD's own precedence statements first ("the text wins over the frames", "the table is a
   summary"). A conflict that such a statement settles is not asked.
b. **Suggested-answer test.** If your suggested option is backed by a sentence already in a source, quote that sentence
   in the case and do not ask.
c. **Silence is not a gap when another source speaks.** If the PRD is silent but the technical plan, a design frame or
   the design library states the behaviour, write the case from that source. Ask only when sources that speak disagree,
   or the gap carries money, data-loss or security risk.
d. **Design library over a single frame.** A design-library "always/never" rule settles a frame that breaks it, unless
   the PRD says otherwise.
e. **Untestable goes to the list.** A requirement with no screen or flow to exercise goes on the "not testable" list with
   its reason; it is never a question.
f. **Right owner.** If the PRD names another owner, or marks the point as pending someone else, hold the case on that
   owner and do not ask the product owner.
g. **Behaviour first.** If only wording is missing and the behaviour is settled, test the behaviour, leave the exact
   wording out, and do not ask.
h. **Final filter on the merged list.** When several people or workers drafted questions, run a–g again on the merged
   list before it is sent.

**How a question is written**
- One row per question: the feature name, a short topic, the question in plain words with lettered options, why we ask
  (what each source says), an empty answer cell, and the source references.
- Recommend one option.
- New questions go at the bottom of the suite's existing sheet, numbered on, in a new colour noted in the sheet's colour
  guide with the date. A question withdrawn after sending is deleted from the sheet (keep a copy first); the others keep
  their numbers.
- Cases held on a question carry `AUTOMATION: HOLD - waiting on the PO (question n)` and sit in the "Waiting on …"
  folder until the answer arrives. When it arrives, the affected cases are rewritten top to bottom and released into the
  run.
