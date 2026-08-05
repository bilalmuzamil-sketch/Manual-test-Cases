# Report Suite — DELETIONS

## NOTHING WAS DELETED IN THIS PASS. `delete_case` was not called once.

**Count: 0 deletions of 473.** `delete_case` is irreversible, and the brief's own instruction was to be
conservative and keep-and-flag when in doubt.

## Why nothing qualified

The authorisation to retire covers cases that are **duplicated, spec-parroting, untestable, or descoped by
the product owner**. This pass was an expected-behaviour audit, and it found the opposite problem: cases
whose expectations had been **weakened**, not cases that should not exist. A case asserting the wrong thing
is **repaired**, never deleted — deleting it would destroy real coverage and hide the error.

The 2026-07-28 consolidation already removed 57 cases and merged 41 groups, so the easy duplication was
taken out then.

## The one deletion CANDIDATE, flagged and NOT acted on

| Case | C-id | Why it is a candidate | Why it was NOT deleted |
|---|---|---|---|
| TU-EXP-10 | [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) | It tests **two** Technician Utilization spreadsheet downloads. The build offers one, and **no source mentions a second** — it was authored from an inference. | It is **Q7 to Chris**. If he says one spreadsheet is correct, this case should be deleted; if he says two, it is real coverage for something not yet built. **Deleting it before he answers would destroy the question.** It carries `AUTOMATION: HOLD` meanwhile. |

**One deletion is therefore pending exactly one sentence from Chris Ward.**
