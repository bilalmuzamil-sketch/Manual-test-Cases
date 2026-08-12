# Schedule — cases whose automation marker changed, 2026-08-12 (finish2)

**Two cases changed marker. Both moved `AUTOMATION: READY` → `AUTOMATION: HOLD`.**

| Case | Was | Now | Why |
|---|---|---|---|
| [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | `AUTOMATION: READY` | `AUTOMATION: HOLD - the control this test needs does not exist in this build; a ticket cannot be raised yet` | there is no way to collapse a department group — `DIVERGENCES.md` §A1 |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | `AUTOMATION: READY` | `AUTOMATION: HOLD - the toggle displays nothing in this build; a ticket cannot be raised yet` | the Tech Hours toggle displays nothing, with its precondition proven met — `DIVERGENCES.md` §A2 |

## Why HOLD and not `READY - EXPECT FAIL`

Under Standing Rule 61 the correct marker for a **known** failure is
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`, carrying the ticket number so the automated suite itself
reports a fix that ships or a failure that changes.

**That marker needs a ticket number, and no ticket can exist:** the creation hold is active (Standing
Rule 62 and the QA lead's 2026-08-10 ruling, verbatim *"Do not create anything until my next order."*).

So each sits on `HOLD` **naming the real blocker**, and **each becomes one edit the moment the hold
lifts.** This is the precedent already recorded in `CLAUDE.md` for exactly this situation: *"cases
sitting on `AUTOMATION: HOLD` only because an expect-fail marker needs a ticket number that does not
yet exist stay on `HOLD`."*

## Effect on the gate

| | before | after |
|---|---|---|
| `AUTOMATION: READY` | 143 | **141** |
| `AUTOMATION: READY - EXPECT FAIL` | 4 | **4** |
| `AUTOMATION: HOLD` | 29 | **31** |
| **ready to automate** | 147 | **145** |

**The gate closes both ways: 141 + 4 = 145, and 176 − 31 = 145.** Read back live from the cases
themselves at 2026-08-12T07:56:09Z, not computed from these notes.

**The figure went DOWN by two, and that is the point of the exercise.** A lower honest figure is worth
more than a higher one that a tester discovers is wrong on the morning of release.
