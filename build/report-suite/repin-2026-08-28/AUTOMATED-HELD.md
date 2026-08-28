# Report Suite — Automated cases held for the QA lead — 2026-08-28

Rule 71: a case TestRail flags as **Automated** (`custom_atmstatus = 3`) is read-assessed
and then held. **Not one of these was written, and not one was opened for editing.**

All of them are in the approved Group C re-pin set — the change each needs is the cited
specification version bumped to the live version. **Bookkeeping only; no behaviour changes.**

The `Expected container` column matters: **35 of the 39** render their Expected Result in a
bare `markdown` container, so even with permission they must go through the TestRail UI
editor, never the API.

| C-id | Report | Pin now → needs | Expected container | Safe route if released | Link |
|---|---|---|---|---|---|
| C30217 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30217 |
| C30221 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30221 |
| C30247 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30247 |
| C30255 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30255 |
| C30256 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30256 |
| C30262 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30262 |
| C30271 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30271 |
| C30272 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30272 |
| C30274 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30274 |
| C30275 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30275 |
| C30276 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30276 |
| C30277 | SBR | 22 → **24** | `markdown fr-view` | API is safe | https://shopview.testrail.io/index.php?/cases/view/30277 |
| C30293 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30293 |
| C30314 | SBR | 22 → **24** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30314 |
| C30322 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30322 |
| C30326 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30326 |
| C30328 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30328 |
| C30333 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30333 |
| C30338 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30338 |
| C30346 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30346 |
| C30351 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30351 |
| C30352 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30352 |
| C30353 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30353 |
| C30354 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30354 |
| C30375 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30375 |
| C30377 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30377 |
| C30390 | PV | 10 → **11** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30390 |
| C30451 | WIP | 22 → **28** | `markdown fr-view` | API is safe | https://shopview.testrail.io/index.php?/cases/view/30451 |
| C30452 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30452 |
| C30460 | WIP | 21 → **28** | `markdown fr-view` | API is safe | https://shopview.testrail.io/index.php?/cases/view/30460 |
| C30462 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30462 |
| C30498 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30498 |
| C30506 | WIP | 22 → **28** | `markdown fr-view` | API is safe | https://shopview.testrail.io/index.php?/cases/view/30506 |
| C30507 | WIP | 22 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30507 |
| C30508 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30508 |
| C30510 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30510 |
| C30511 | WIP | 22 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30511 |
| C30515 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30515 |
| C30527 | WIP | 21 → **28** | `markdown` | UI editor only | https://shopview.testrail.io/index.php?/cases/view/30527 |

**39 Automated cases, 39 untouched.**

Separately, **C30518** (also Automated) is still carrying render damage from the
2026-08-26 pass and still needs its own go-ahead — see
`build/report-suite/damage-2026-08-26/FINAL-SUMMARY.md` §3.

> **✅ CORRECTED 2026-08-28 — THE LINE ABOVE IS OUT OF DATE, kept visible per Rules 32/33.**
> **C30518 was REPAIRED at 03:07 UTC on 2026-08-28** by another session, with the go-ahead it names:
> the render damage is **fixed**, the case was **re-pinned v21 → v28** in the same pass, and
> `custom_atmstatus` is **still 3 (Automated)** — so it is **no longer damaged and no longer awaiting
> a go-ahead**, and it is **not** part of the 39 held above. Evidence:
> `build/report-suite/damage-2026-08-26/C30518-REPAIR-2026-08-28.md`.
> **Rule 65 applies — Vlad must be told, because an Automated case was changed;** the entry is logged
> under the 2026-08-28 heading in
> `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

## OUTSTANDING — what I need from you

1. Per-case (or blanket) go-ahead to re-pin these 39 Automated cases.
2. Vlad still needs to be told, per Rule 65, for any of them we do change.
