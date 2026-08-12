# What changed in TestRail — Schedule, 2026-08-12

**9 `update_case` operations over 8 cases. Nothing else.** No case was created, deleted or moved; no
section was touched; `update_run` was never called and no result was logged anywhere.

## The seven held cases

| Case | Marker before | Marker after |
|---|---|---|
| [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | `HOLD - not re-checked against the current build - it needs a drag that could not be completed` | `READY - EXPECT FAIL (SV-8886)` |
| [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | same | `READY - EXPECT FAIL (SV-9090)` |
| [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | same | `READY - EXPECT FAIL (SV-9006)` |
| [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | same | `HOLD - an observed fault on this case has no ticket number yet…` |
| [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | same | same precise `HOLD` |
| [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | same | same precise `HOLD` |
| [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | same | same precise `HOLD` |

**No expected result was changed** (Standing Rule 57). Each case keeps exactly the behaviour its
sources require. What was ADDED is the observed symptom in plain words plus the three outcomes a
tester needs, and what was REPLACED is the provenance line's second sentence and the marker.

## The eighth case

[C29980](https://shopview.testrail.io/index.php?/cases/view/29980) — the label `'finish by'` corrected
to **`'Finish by'`**, plus a note telling the tester what to do about point 2, which was not
re-checked. Marker unchanged at `AUTOMATION: READY`.

## Why four cases stay on HOLD

Because the fault each one found **has no ticket number**, and an `EXPECT FAIL` marker has to name
one. **Nothing is created while the QA lead's "create nothing until my next order" hold stands**
(Standing Rule 62). Each of the four is **one edit away** from `READY - EXPECT FAIL` the moment a
ticket exists.

**The hold reason is now true, which it was not before.** *"It needs a drag that could not be
completed"* had been copied across all seven and was wrong on five: three of them need no drag at all.
