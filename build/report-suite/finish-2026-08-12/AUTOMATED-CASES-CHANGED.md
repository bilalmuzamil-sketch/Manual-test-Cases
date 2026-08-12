# AUTOMATED CASES CHANGED — FOR VLAD

**Report Suite · 12 August 2026 · build `v3.7-4626299`**

TestRail's own `custom_atmstatus` was captured **at write time** for every case this pass wrote,
because the flag moves in both directions and reading it afterwards can give a different answer.

**One case we changed carries `custom_atmstatus = 3` (Automated).**

| Case | What changed, in one phrase | Does it change what an automated check should conclude? |
|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Its automation marker went from `READY` to `READY - EXPECT FAIL (SV-9074)`, and a note was added saying the Product Type filter is still the old single-select. **No step and no expected result was altered.** | **YES.** This case is expected to FAIL on today's build. An automated run should treat a failure here as the known SV-9074 gap, not a new defect — and should report it if it starts PASSING, because that means the fix shipped. |

**The other two cases written this pass are NOT flagged Automated** and need no action:
[C43591](https://shopview.testrail.io/index.php?/cases/view/43591) (`custom_atmstatus = 1`) and
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913) (`custom_atmstatus = 1`).

**No case had its `custom_atmstatus` set, cleared or otherwise touched by this pass.**
All 40 Automated cases in the Report Suite were flagged by Vladimir Tomovic himself.
