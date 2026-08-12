# Filters — AUTOMATED CASES CHANGED, FOR VLAD — 2026-08-12

## none

**This pass wrote to exactly one case, [C43590](https://shopview.testrail.io/index.php?/cases/view/43590),
and its TestRail `custom_atmstatus` reads `1` (Not Automated) — captured at write time, and read back
as `1` afterwards.** Nothing Vlad automates was touched.

**The four Filters cases Vladimir Tomovic marked Automated by hand are C29600, C29614, C29623 and
C38877.** None of them was written to by this pass; all four are among the 114 proven to carry an
unchanged `updated_on`/`updated_by`.

The flag was read from the same `get_case` snapshot the Rule-50 byte-check already takes, **at write
time rather than afterwards**, because the flag moves in both directions.

**Nothing to forward.**
