# Filters — divergences, verify-final, 2026-08-12

> **⚠️ PARTIAL — STOOD DOWN BEFORE THE RUNNABILITY WALK BEGAN.**

## NOTHING DIVERGED, BECAUSE NOBODY CHECKED — and those are not the same statement

**This file records ZERO divergences, and the reason is that the runnability walk never started, not
that the walk found the suite clean.**

The distinction is the whole reason this file exists even when empty. A reader must not be able to
mistake *"no divergence was found"* for *"the cases were checked and agreed with the build"*.

| | |
|---|---|
| Cases whose **preconditions and steps were walked on the build** | **0 of 115** |
| Cases whose **navigation path was verified to exist** | **0** |
| Cases whose **controls were confirmed present where the step says** | **0** |
| **Substantive divergences found** | **0 — none looked for** |
| **Cosmetic label corrections found** | **0 — none looked for** |

**No case in this suite has had its steps walked against `v3.6-3e9dd6d` by this session.** What was
established is only the build marker and the two identities; see `RESUME.md`.

---

## THE ONE DIVERGENCE ALREADY ON THE RECORD, CARRIED FORWARD UNRESOLVED

Not found by this session — inherited from `build/filters/build-viu-2026-08-12/LABEL-DIFF.md` and
`build/filters/build-verify-2026-08-11/`, and **still owed**.

### C38891 — roughly 42 surface names, two of them known wrong

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — *"Every list page keeps its
own search box (Parts, Reports, …)"*.

| The case says | The build's navigation reads |
|---|---|
| `IBS Batch Transactions` | **`IBS Batches`** |
| `Sales Tax Invoices` | **`Sales Tax Collected`** |

**Category: cosmetic on the face of it — but deliberately NOT corrected, twice, and the reasoning
should survive.** Correcting two names inside a list of forty would make the case *look* freshly
verified while the other forty remained unchecked, and the case still could not be run end to end.
**What it needs is one pass that walks all 42 surfaces at once**, against the live specification's
own `S14-R6` surface list — which carries an explicit warning that seven surfaces are named
differently in code than in the interface, and that surfaces should be located **by URL rather than
by name**.

**It is not raised as a defect against the product.** The build's names are the build's; the case is
the thing that is out of date.

---

## WHAT A DIVERGENCE ENTRY MUST CONTAIN WHEN THE NEXT PASS FINDS ONE

Recorded here so the format is not re-invented, and so the two categories stay separate:

- **COSMETIC** — a renamed control, a moved menu item, a changed label, the same route reached by a
  slightly different path. **Correct it and log it.** The expectation is untouched; only the Rule-9
  layer moves.
- **SUBSTANTIVE** — the route or the state the source describes **does not exist** on the build.
  **Never silently rewritten.** Quote both texts side by side, name the C-ids, give the case the
  smallest change that stops a tester being stranded, and raise it.

**The test: would a reader of the source recognise what the build offers as the same thing?** Yes →
cosmetic. No → substantive.

**And the trap worth restating:** a precondition the sources require but the build cannot achieve is
usually evidence that the **build** is wrong, not the case. Rewriting it deletes the finding.
