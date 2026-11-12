# Internal Work Orders — were all 16 questions to Milos needed? (review, 12 Nov 2026)

QA lead, 12 Nov 2026: "see if Milos's answer highlights our mistakes like if there is something explicitly clear in the PRD and in the
design and still we asked him a question which was unnecessary … unnecessary questions are flagged as the cause of wasting the time
of the product owner."

Judged against what we held BEFORE asking: PRD v1.0, the 28 tickets, the tech plan, the design (boards and design library). Milos's
answers are in `ANSWERS-Milos-Vasic-2026-11-12.json`. The coordinator passed every one of these questions; the miss is ours, not the
workers' alone.

## Verdicts

| # | Topic | Verdict | Why |
|---|---|---|---|
| 1 | First-time window text | Needed | The PRD gave two different texts (S1-R2 and the §8 row) and states no rule for which wins. Milos confirmed a PRD mistake. |
| 2 | "NO CHARGE document" capitals | Needed | Same: S2-R5 and §8 differ, no precedence stated. A PRD mistake, now fixed. |
| 3 | Stamp on the internal estimate | Needed | S2-R4 and S3-R5 contradicted each other. |
| 4 | Rows per account pair | Needed | The tech plan and the PRD disagreed (a code-vs-document conflict is a PO decision, Rule 96). |
| 5 | "Closed" in the Status filter | Needed | Plan vs PRD disagreement. |
| 6 | Imported work orders | **Not needed** | No work order import exists, so S2-E3 has no screen to test. It belonged on the "not testable, with reason" list. Milos: "Keep the rule with no test now." |
| 7 | Portal deposit after Convert | **Avoidable** | The PRD was silent and the tech plan spelled the behaviour out. Under Rule 115 that is an ADD: write the case citing the plan. Milos chose exactly the plan's behaviour. |
| 8 | Hub refuses to deactivate | Needed | The plan contradicted S6-E1. |
| 9 | Lines after Convert to Billable | **Not needed** | The PRD's own dialog text already says "Every line is priced as a new line would be today." and the plan agreed. Our own suggested answer quoted that sentence. Milos answered by quoting it back. |
| 10 | work_order.updated webhook | **Wrong person** | The PRD marks this as a proposal for the Open API owner. Milos could only say "test against (a) … confirmation is still pending". It should have been held on the Open API owner, not asked of the PO. |
| 11 | Comeback rate with nothing to divide by | Needed | No source said what to show; a number here would mislead (Rule 116). |
| 12 | Category helper texts | Avoidable (borderline) | The behaviour was already settled by the PRD; only the helper wording was missing. We could have tested the behaviour and left the helper wording out of the cases. |
| 13 | "Locked" note on a closed work order | **Not needed** | The PRD's header says "Where a frame and this text disagree, the text wins", and the text gives the header line. Milos: "the design frame is wrong and the text wins." We had already used this clause to settle 45 other differences. |
| 14 | "Reopened" message | **Avoidable** | The PRD was silent and the design showed the message. Where the PRD is silent the design is a source (Rule 57 lists it; Rule 126). Milos chose the design. |
| 15 | Dash in empty report cells | **Avoidable** | The design library says an empty cell always shows a dash, "never an empty cell". A design-library "always/never" rule is in scope (Rule 126) and is more general than one frame. Milos: "as the design library says". |
| 16 | Report numbers wrapping | Needed | The design drew wrapping, which our rules would have accepted as the look. Milos wanted no wrapping, so asking changed the result. |

**Count: 8 needed (1, 2, 3, 4, 5, 8, 11, 16), 8 that we should not have sent as they were.**
- **Clearly unnecessary (3):** 6, 9, 13.
- **Avoidable by our own rules (4):** 7, 14, 15, and 12 (borderline).
- **Sent to the wrong person (1):** 10.

## What went wrong (root causes)

1. **We did not apply the PRD's own precedence clause.** "Where a frame and this text disagree, the text wins" was read and used for 45
   register rows, yet question 13 still went out (the design worker explained it as "may be the note an invoiced work order shows today").
2. **We did not test our suggested answer against the sources.** When the suggested option quotes a source sentence that decides the
   point (q9), the question is answered already.
3. **"PRD silent" was treated as "ask", even when another source spoke.** The tech plan (q7), the design frame (q14) or the design
   library (q15) is a source under Rules 57, 115 and 126. Asking is only right when the sources that speak disagree, or the gap is risky.
4. **Untestable requirements went to the PO instead of the "not testable" list** (q6).
5. **We did not check who owns the decision** (q10): the PRD names another owner.
6. **Wording-only gaps were raised although the behaviour was settled** (q12).
7. **Three workers each drafted questions, and the merge removed only duplicates.** Nobody re-ran a "does a source already settle this"
   check on the merged list before it was sent.

## Proposed additions to skill 07 §6 (the check before any question is sent) — awaiting the QA lead's approval (Rule 72)

Before a question goes on a sheet, each one passes all of these. A question that fails any of them is dropped, or moved, with the reason written down:

a. **Precedence.** Read the PRD's own precedence statements first ("the text wins", "the table is a summary", and so on). A conflict that such a statement settles is not asked.
b. **Suggested answer test.** If our suggested option is backed by a sentence already in a source, quote it in the case and do not ask.
c. **Silence is not a gap when another source speaks.** If the PRD is silent but the tech plan, a design frame or the design library states the behaviour, write the case from that source (Rules 57, 115, 126). Ask only when those sources disagree with each other, or when the gap carries money, data loss or security risk.
d. **Design library over a single frame.** A design-library "always/never" rule settles a frame that breaks it, unless the PRD says otherwise.
e. **Untestable goes to the list.** A requirement with no screen or flow to exercise goes on the "not testable" list with its reason; it is never a question.
f. **Right owner.** If the PRD names another owner, or marks the point as pending someone else, hold the case on that owner and do not ask the PO.
g. **Behaviour first.** If only wording is missing and the behaviour is settled, test the behaviour, leave the exact wording out, and do not ask.
h. **One final filter on the merged list.** The coordinator runs a–g on the merged sheet, not only per worker, and records for each kept question which check it passed.

Proposed lessons-register row: **L-19 — Unnecessary PO questions (Internal Work Orders, 12 Nov 2026): 8 of 16 were settled by a source, untestable, or for another owner; checks a–h above.**
