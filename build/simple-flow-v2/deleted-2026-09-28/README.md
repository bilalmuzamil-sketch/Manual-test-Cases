# Nine Simple Flow V2 cases deleted — 28 September 2026

Deleted on the QA lead's instruction. Two (C44574, C44579) he deleted himself; the other seven this
session deleted after raising the concern below and receiving his confirmation.

`SNAPSHOT.json` holds the complete body of all seven this session deleted — title, preconditions,
steps, expected results, section, references and every field — read live from TestRail immediately
before deletion. **The TestRail records and their results in run 416 are unrecoverable; the content
is not.** All seven were `created_by = 3` (ours) and none carried the Automated flag, so neither
Rule 38 nor Rule 71 was engaged.

| Case | Why it was on the list | The concern that was raised |
|---|---|---|
| C44564 | Failed — clock-out screen keeps the old tick box and has neither new button | The **source contradicts itself**: line 176 of the spec text says the current production screen with the "Line completed" toggle is kept, line 177 says that tick box is hidden and two new buttons replace it. The build matches 176. Nobody decided which governs; this case was the only record of it. |
| C53487 | Failed — a supplier can still be changed after parts have been received | An unruled product defect against spec line 410. Deleting the case does not change the product. |
| C44551 | Blocked — needs a brand new shop | Blocked on a shop the QA lead said he would provide, not on anything wrong with the case. |
| C44586 | Blocked — one invoice number across two of a supplier's orders | Rested on the **same spec sentence the QA lead overturned the same day** (line 456). It was wrong for exactly the reason C44591 was, and could have been corrected the same way rather than deleted. |
| C44588 | Blocked — receive window turning away invalid parts | Needed part states that could not be built in the time available. |
| C53489 | Blocked — deferring a part that carries a core | Raised a genuine product question: a core charge exists only on stocked parts, and stocked parts are never offered for ordering, so the pairing cannot exist on this build. |
| C44598 | Blocked — a second person finishing work mid-run, plus a server error | Needed two people acting at the same instant and an error that cannot be caused to order. |

**What this means for coverage.** Run 416 now reads 55 cases, all passing, with nothing failed and
nothing blocked. That is a smaller suite, not a healthier one: the two product findings above are
still true of the build and are no longer covered by any case, and the five blocked areas are now
untested rather than known-untested.

**Still outstanding regardless of the deletions**
- The specification sentence about reusing an invoice number (page 771391574, line 456) still says
  the opposite of the QA lead's ruling and needs correcting at source.
- The line 176 versus line 177 contradiction about the clock-out screen is unresolved.
- The supplier-after-receiving behaviour (was C53487) has had no ruling.
