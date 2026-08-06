# FILTERS — Vlad's coverage-gap table (eleven rows). QUEUED CAPTURE, NOT THE ANALYSIS.

> ## ✅ WORKED 2026-08-06 — this file is now the RECORD OF THE ASK, not a to-do.
> **The analysis, the verdicts and the writes are in `build/filters/vlad-gap-review-2026-08-06/`.**
> Read `ROOT-CAUSE.md`, then `ROW-BY-ROW.md`, then `NEW-CASES.md`.
> **Outcome: Vlad is right on 6 of the 12 rows (his 11, one split per assertion), mistaken on 5, and
> one row was never a gap.** Row 1 turned out to be a **Rule-57-class defect in our own suite**, not a
> gap. **5 cases corrected · 4 new cases authored (C43560, C43561, C43562, C43563) · 4 questions to
> Branko · the run-352 sync STAGED and NOT executed.** All twelve rows were settled **from documents
> alone**; the branch API was dead all session, so **nothing was observed live.**

**State: QUEUED — not started.** Raised by **Vlad (automation engineer)** via the QA lead,
**2026-08-06**. **To be worked only after all other outstanding work is complete, on the QA lead's
explicit instruction.**

This file is a **durable transcription** so the request survives this container. **No analysis has
been done. No case has been checked. Nothing has been verified. No TestRail or Jira call was made.**

---

## WHAT THE QA LEAD ASKED FOR — verbatim

> "Vlad has shared me this screenshot for the FILTERS project asked me that we missed creating cases
> for the following: I am not sure how we missed them, I would need a root cause of missing to create
> the cases in simple words and also to check if we really have not created them fully as needed and
> if they are created I would need th elink for those test cases andif they are not created I would
> need to create them. But do that after everything else has ben done."

So there are **FOUR deliverables**:

1. **A ROOT CAUSE in simple words** explaining how these were missed.
2. **A VERIFICATION per row** of whether the coverage really is **absent**, **partial**, or **actually
   present**.
3. **For anything that DOES exist** — the case's internal ID + C-id +
   `https://shopview.testrail.io/index.php?/cases/view/<id>` link (**Standing Rule 8**).
4. **For anything genuinely missing** — the case **authored**, which is a **TestRail write** and needs
   his **go-ahead** (**Rule 6**).

---

## VLAD'S TABLE — the eleven rows, transcribed exactly

| # | REQUIREMENT | GAP | OWNING LAYER |
|---|---|---|---|
| 1 | `S9-R2 / S9-R3` | No case covers the *decided* Status-chip behaviour — greyed out and pre-filled. Only the rejected "hidden" version has cases. | fe-unit + 1 e2e |
| 2 | `S11-R7` | "Back to my view" restoring saved filters and clearing the query. Only the negative case exists (C38896). | e2e |
| 3 | `S10-R2` | Cross-device sync and last-write-wins. No case at all. | be-functional + manual |
| 4 | `S13-R19` | Mobile kebab collapse where a toolbar has 2+ icon actions — Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected). | fe-unit |
| 5 | `S13-N4` | Query not restored after the browser tab session ends. | fe-unit |
| 6 | `S14-R6` | The 42-surface, 39-component sweep of global-search removal is covered by 2 cases. | e2e breadth |
| 7 | `Parts views` | Per-view chip sets undefined for 6 of 8 pages; only 3 have a filter kit in the build. | blocked on the write-up |
| 8 | `Reports` | No case asserts the date-range URL contract (`range=custom&from=…&to=…`). | fe-unit |
| 9 | `R3 Q5 · parity` | Parts and Reports are meant to match Work Orders on clearing, collapse, persistence, shareable URL and mobile. Only C38908 speaks to parity at all, and it covers *which filters exist*, not how they behave. | fe-unit + 1 e2e |
| 10 | `R3 Q5 · exception 2` | Date-range is a **single range, not multi-select**. C38882 covers presets and custom ranges but never asserts the single-selection constraint. | fe-unit |
| 11 | `— (build only)` | Mobile imported-exclusivity. `MobileAllFiltersSheet.spec.ts` covers "imported locks status and clears other filters" and "strips imported when a non-exclusive status is the last toggled"; §4110 covers Imported on desktop only (C38877). | fe-unit ✓ / e2e gap |

---

## NOTES FOR WHOEVER WORKS THIS — starting hypotheses, **NOT conclusions**

- **This is a REQUIREMENT-SIDE gap list, a different axis from the pass just completed.** That pass
  verified all **110** cases we **HAVE**, each driven live. It did **NOT** re-derive whether **110 is
  the RIGHT SET**. **Standing Rule 43** requires the coverage matrix to be **re-derived per spec
  version in BOTH directions** — requirement→case and case→requirement — and **Rule 45** requires the
  outside-in hunt. **Check whether either was actually run in the requirement→case direction against
  Filters spec v18.**

- **SEVERAL ROWS NAME CASES THAT EXIST** — **C38896** (row 2), **C38908** (row 9), **C38882** (row 10),
  **C38877** (row 11). Those are claims of **PARTIAL** coverage, **not absence**. Verify each against
  the case's **live text** and quote **BOTH the requirement and the case's expected result side by
  side** (**Rule 45(e)**) before agreeing or disagreeing.

- **ROW 7 is marked "blocked on the write-up" by Vlad himself.** The QA lead **RULED on 2026-08-05**:
  *"OK, lets wait for Brankos PRD"*. So Parts/Reports coverage is a **DELIBERATE HOLD, not a miss** —
  and **Rule 46** says an undocumented deliberate omission is **indistinguishable from a miss**. Check
  whether that hold was **recorded in a deliberate-decisions register** and whether that register
  **ever reached Vlad**. **If it did not, that is part of the root cause and it is our failure, not
  his.**

- **ROW 11 says a test in the codebase covers it.** So the question there is whether a **MANUAL case is
  owed at all**, or whether the **automated test is sufficient coverage** — a judgement **the QA lead**
  should make.

- **ROW 1 is the sharpest:** it says our cases cover the **REJECTED** version of a decision and not the
  **DECIDED** one. Note that Filters **S9-R2/S9-R3** were the subject of a **Branko ruling that
  superseded his own earlier 17 July answer**, and two of our cases (**C29609/C29610**) were changed for
  exactly that reason. **Verify whether those cases now assert the decided behaviour or the rejected
  one — if the rejected one, that is a Rule-57-class defect, not merely a gap.**

- **HONESTY:** this is the **FOURTH time this week** an outsider has found something our own checks did
  not — **Vlad in July on the SBR export columns**, **Ahtasham twice on Filters**, and **now this**.
  **The root cause deliverable should address that pattern, not just these eleven rows.**

---

## Constraints observed while writing this file

Record-only. **No TestRail calls · no Jira calls · no app access · no case edits · no analysis.**
An **OUTSTANDING-ITEMS-REGISTER** row was added in the same commit (**Standing Rule 36**).
