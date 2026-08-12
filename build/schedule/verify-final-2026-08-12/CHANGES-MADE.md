# Schedule — every change made, verify-final, 2026-08-12

**56 `update_case` operations over 56 distinct cases.** No case was written twice.
**0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes · 0 results · 0 Jira calls.**
`custom_atmstatus` was never sent.

---

## 1 · Forty-five cases: Rule-54 sentence 2 re-stamped

**Changed:** the build and date in sentence 2 → `Last checked against build v3.5-65d6500 on 12 August 2026.`
**Unchanged:** the expected behaviour, sentence 1 (the SOURCE of the expectation), the automation
marker, the title, the preconditions, the steps and `refs`.

The standard each of the 45 had to meet, and the 129 that did not, is `RESTAMP-EVIDENCE.md`.

## 2 · Six cases: the Technician session

| Case | Marker before | Marker after | Why |
|---|---|---|---|
| [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | `HOLD - needs a second sign-in as a view-only user` | **`READY`** | driven end to end; all four items pass |
| [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | same | **`READY`** | all four items pass |
| [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | `HOLD - … view-only technician` | **`READY`** | both items pass |
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | `HOLD - needs a second sign-in as a user with no staff record` | `HOLD` — **reason sharpened** | points 1–3 observed and pass; point 4 still needs that user |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | `HOLD - needs three separate sign-ins` | `HOLD` — **reason sharpened** | point 2 observed and passes |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | `HOLD - … cannot see work orders` | `HOLD` — **reason sharpened** | point 1 observed and passes |

**Not one precondition and not one step was edited on any of the six** — all were verified against the
build and found executable as written. The payload builder asserted, before sending, that the expected
behaviour and provenance sentence 1 were byte-identical, and refused to build otherwise.

## 3 · Five cases: the surface probes

| Case | What changed |
|---|---|
| [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | stamp only — `Clear all` confirmed exact (`button_sidebar_filters_clear`) |
| [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | stamp only — `This shift only` confirmed exact |
| [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | stamp only — a middle shift confirmed offering all three options |
| [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | **step 1 corrected**: `this and everything after` → **`This and all later shifts`** |
| [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | **stale known-issue note replaced**; marker → the no-ticket `HOLD` |

### The two that were not cosmetic

**C30059** told the tester to use a scope called `this and everything after`. **No such option
exists.** The build offers `This and all later shifts`. A tester would have opened the dialog, hunted
for wording that is not there, and stalled — on a delete-scope case where guessing is expensive.

**C30034** carried a note asserting the tooltip listed **all five** line names with no overflow row.
**The build no longer does that** — a six-line shift showed exactly three names and `+3 more lines`.
The stale note was replaced with what is actually wrong now: the VIN appears only when the
`VIN Number` toggle is ON, while the documented decision asks for it either way.
**The expected behaviour itself was not touched** (Rule 57) — the disagreement is recorded as a
deviation, and the marker is the no-ticket `HOLD` because the creation hold bars filing a ticket.

## 4 · What was deliberately NOT changed

- **C30061's expected result**, which names the scope options in shorthand. Raised, not edited.
- **The 100 cases quoting no on-screen label.** Stamping them would have taken the headline from 76 to
  176 and meant nothing.
- **The 29 cases with a label on an unreached surface.** They are a worklist, not a verdict.
- **Anything in Jira.** The creation hold is active; findings are written up instead.
