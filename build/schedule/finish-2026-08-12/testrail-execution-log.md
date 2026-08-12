# TestRail execution log — Schedule finish pass, 2026-08-12

**3 `update_case`. 0 add · 0 delete · 0 section · 0 run · 0 result. `custom_atmstatus` never sent.**

Every payload carried **all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`) because TestRail re-renders any text field it is not sent. Every write was
re-GET and byte-compared field by field against the intended payload, with every field the pass did
not intend to change proven byte-identical (Rule 50). Machine log: `evidence/testrail-oplog.json`.

**All three are LABEL corrections, not expectation changes (Rule 57).** Each replaces the name of a
control the tester must find with the name the control actually carries on `v3.5-65d6500`. **No
assertion was altered in any of them.**

| # | Case | Field | Was | Now | Result |
|---|---|---|---|---|---|
| 1 | [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | `custom_preconds` | `'Filter and Display'` | **`'Filter & display'`** | HTTP 200 · 30 fields compared · 3 intended · **0 mismatch** |
| 2 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | `custom_steps` + `custom_expected` | `the 'Filter' button` | **`the 'Filters' button`** | HTTP 200 · 30 fields compared · 3 intended · **0 mismatch** |
| 3 | [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | `custom_steps` | `the 'this shift only' scope` | **`the 'This shift only' scope'`** | HTTP 200 · 30 fields compared · 3 intended · **0 mismatch** |

**Where each new label was read.**
· `Filter & display` — the toolbar dropdown's own panel, opened live this pass; header `FILTER & DISPLAY`,
  contents `Service · Work order status · Service/Parts · My Shifts · VIN Number`.
· `Filters` — the sidebar control, visible in the page body text and confirmed when its panel was opened.
· `This shift only` — the delete-scope dialog, read on **this same build marker** by the pass of
  2026-08-12 recorded in `verify-final-2026-08-12/DIVERGENCES.md` §F, alongside `This and all later
  shifts` and `Entire series (8 shifts)`. **Not re-observed by me** — the build has not moved, and
  re-observing it would mean pressing Delete again, which is what destroyed a shift earlier today.
  **Stated plainly rather than implied.**

**On editing a label inside an expected result (write 2).** Rule 57 forbids changing what a case
expects; it requires the build's labels to be used. The assertion — *"the active-count badge on the
button disappears (or shows zero)"* — is untouched; only the control's name changed. Leaving the two
halves of the same case naming the control differently would be worse than either.

## Not written, and why

| Considered | Decision |
|---|---|
| Re-stamping the build line on the cases I walked | **Not needed — all seven already name `v3.5-65d6500`.** |
| Re-stamping the 100 cases that do not name this build | **Refused.** I verified their *labels*, not their steps. A build line asserts the case was checked against that build, and writing it from a label harvest would be a claim I did not earn. |
| Adding a warning to C30015 step 3 about the no-confirmation delete | **Raised, not written** — see `RUNNABILITY.md` §6. It is a wording decision on the case's own assertion. |
| Aligning C30061's expected result to the build's scope wording | **Raised, not written** — an expected result is not ours to edit; carried forward from the previous pass. |
| Any marker change | **None made.** Nothing I found moved a case between READY, EXPECT-FAIL and HOLD. |
