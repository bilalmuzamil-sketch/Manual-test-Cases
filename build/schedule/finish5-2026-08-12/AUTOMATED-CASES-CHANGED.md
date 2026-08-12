# AUTOMATED CASES CHANGED — FOR VLAD

**Schedule finish5, 2026-08-12, build `v3.5-65d6500`.**

## NONE.

**No case this pass wrote is flagged Automated by TestRail.**

The marker that decides this is TestRail's **own field `custom_atmstatus`** (3 = Automated), not
our `AUTOMATION:` text marker — the two disagree, and the field is the one that answers the
question (Standing Rule 64, settled 2026-08-11).

**Captured at write time**, because the flag moves in both directions and a later reading can
differ from the truth at the moment of the write:

| Case | `custom_atmstatus` at write time | Meaning |
|---|---|---|
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | **1** | Not Automated |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | **1** | Not Automated |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | **1** | Not Automated |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | **1** | Not Automated |

[C29986](https://shopview.testrail.io/index.php?/cases/view/29986) was walked but **not written**,
and also reads 1.

## AND THE WHOLE SCHEDULE SUITE READS ZERO

A live census of all **176** cases in group 4254 finds **0 flagged Automated**. That is the
expected state and it is not an oversight: the 31 Schedule cases that used to carry `3` were
**never set by anyone** — our own `add_case` tooling hardcoded the value — and they were corrected
`3 → 1` on **2026-08-11** (`build/automated-flag-and-c30041-2026-08-11/`).

**So there is nothing on Schedule for Vlad to adjust as a result of this pass**, and no change here
alters what an automated check should conclude.

`custom_atmstatus` was **never sent** on any payload this pass.
