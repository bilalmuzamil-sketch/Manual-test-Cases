# Schedule finish5 — findings

**Build `v3.5-65d6500`, unmoved across the pass. Five cases walked. Four written, all
byte-verified. Run 357 untouched. Zero Jira calls.**

## 1 · All five are runnable, and the two series guards are genuinely well built

Every one of the five preconditions was reachable, every route existed, every named control was
where its step said it would be. **The two guards behind C38863 are worth calling out as good
engineering**, because a lot of this project's findings have gone the other way:

- past 8 weeks → **HTTP 409**, and the message **names the actual span and the exact parameter
  needed to proceed**: *"The series would span 83 days, beyond the 56-day limit. Resubmit with
  acknowledgeLongSeries to schedule it anyway."*
- more than 120 shifts → **HTTP 422**, refused **outright**, and **the acknowledgement does not
  override it** — resubmitting with it still returns 422, which is exactly the *"no confirmation
  can override it"* the case demands.
- **neither refusal left a half-created series** — both created zero shifts.
- the interface says the same thing in the tester's own words: **"This series runs 86 days —
  longer than 8 weeks. Schedule it anyway?"** with `Cancel` and `Create 62 shifts anyway`.

## 2 · The daylight-saving case passes on a real clock change, not a simulated one

The 59-shift series spans **20 August to 10 November**, straddling **1 November**, when
`America/Edmonton` goes MDT → MST. **52 shifts before and 7 after all start at 07:00 local**, while
the UTC instant moves from `13:00Z` to `14:00Z` precisely to keep it there. That is the behaviour
the technical plan describes, and it is stored correctly rather than coincidentally — the offset
change is visible in the data.

## 3 · Four false absences were caught before anything was reported — and one was a check that could not fail

**Nothing was reported as a defect this pass**, and that outcome was not luck. Four readings looked
like findings and every one was our own instrument:

- a **PATCH returning 400 instead of 404** on a foreign shift id looked like a cross-location
  information leak. **A completely random nonexistent UUID returned the identical 400.**
- **`shift.conflicts` was `null` on every shift**, which appeared to confirm C30615's no-conflict
  expectation. **That field does not exist on the payload.** The real fields are `isConflict` and
  `conflictReasons`. **A control that cannot fail is not a control**, and the first version of that
  measurement was worthless — it would have reported "no conflicts" on a board where everything
  conflicted.
- a board request that **looked broken** was a deliberate `400 … may not span more than 62 days`.
- an **`end_date` that appeared ignored** is not a parameter of that endpoint at all.

**The second one is the one to keep.** It is the more dangerous shape, because it produces a
*passing* reading rather than a failing one — a false all-clear, which nobody goes back to check.

## 4 · One cosmetic step correction, and it would have cost a tester a false defect

**[C38875](https://shopview.testrail.io/index.php?/cases/view/38875) step 2** said only *"Also try
PATCH … on the same id"*. Followed literally with an arbitrary body, the build answers **400 `The
request changes nothing.`** while the expected result predicts **404** — so a careful tester would
have recorded a failure and raised a defect against correct behaviour. The step now names a real
field to change. **The route, the state and the behaviour were never wrong; only the instruction
was.** Both texts: `DIVERGENCES.md` §1.

## 5 · Nothing was deleted, and no destructive control was pressed

Two passes on this branch have destroyed a shift by pressing **Delete** expecting a confirmation
that does not appear for a non-series shift. **This pass made no `DELETE` call and never touched
that button.** Where it *did* press a committing control — *"Create 62 shifts anyway"* — the
refusal behaviour had been **established at API level first**, so the worst case was an error
message. **Establish whether a confirmation exists, then press.**

## 6 · The remaining four are blocked by a scope rule, not by the product

**C29971, C30080, C30083, C38870** each need a **role, staff or settings** change. That is the
change class that killed the Technician session on this branch and never gave it back, and it is
awaiting the QA lead's go-ahead. They are unwalked for a **scope** reason and must not be reported
as product gaps.

## Outstanding — what I need from you

1. **One go-ahead to make a role / staff / settings change on `sv8685`.** That single answer
   unblocks the **last four** cases — C29971, C30080, C30083, C38870 — and the suite is otherwise
   finished.
2. **The three Story Defects written up and awaiting you**, chiefly the missing Unassigned row.
   **Nothing was filed** — Jira creation is on hold (Standing Rule 62) and this pass made zero
   Jira calls of any kind.
3. **Nothing else is outstanding on Schedule from this pass.**
