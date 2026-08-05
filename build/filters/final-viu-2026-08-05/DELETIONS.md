# Filters — retirements and deletions, 5 August 2026

## Nothing was deleted. Nothing was retired.

**0 `delete_case`. 0 retirements. 0 merges.**

`delete_case` is irreversible, and the QA lead's authorisation to *"update them/delete them as needed"*
is not a reason to spend it without cause. The conservative rule was applied: **when in doubt, keep and
flag.**

## Why no case earned deletion

| Candidate class | Finding |
|---|---|
| Duplicates | The 2026-07-31 Ruthless Usefulness Audit already consolidated **137 → 110**, retiring 27 locally. A fresh cross-case sweep this pass found **no surviving duplicate pair** among the 110. |
| Spec-parroting | None. Every one of the 110 asserts an observable behaviour, not a restatement of prose. |
| Untestable | None. The 10 `HOLD` cases are testable — they are waiting on the product (8 Parts/Reports features not built) or on a second test login (1) or on the report filter bars (1). **Not built is absent product, not an untestable case**, and those cases must survive to be run when it ships. |
| PO-descoped | None new. The 9 `FLT-SRCH-*` palette cases were already retired and belong to **Global Search** under Branko's ruling. **Not resurrected.** |

## Two groups deliberately left alone

1. **The 27 cases retired locally in the July audit** — they stay retired. `viu_status` starts with
   `Retired`, the generators exclude them, and they are not in the 110.
2. **The 9 `FLT-SRCH-01..09` page-palette cases** — Branko ruled the ⌘K palette is tested under
   **Global Search**, not Filters. They had blank C-ids and were never pushed. **Not resurrected.**

## What was removed — text, not cases

Two removals of *content*, both recorded and both reversible from git:

| Case | What was removed | Why |
|---|---|---|
| C29557, C29602, C29606, C29607, C38899 | the `"Known and accepted: … on purpose for now. Do not raise this as a new problem."` paragraph | It waived a documented requirement and told the tester to suppress a real spec violation. No source supported *"on purpose"*. |
| C29630 | a `"Known issue"` note about a shared-link fault | This case reaches the empty state **by tapping**, never by a shared link. The note would have made a passing case look failed. |

Neither is a deletion of a case, and both are recoverable — the pre-write snapshot of all 110 is
committed at `snapshots/cases-PRE.json`.
