# Gate runs — 2026-09-02

The output of `build/testing-tools/verify_suite.py` on all three authorised suites, kept so a later
session can see what "passing" looked like on this date and diff against it rather than re-deriving.

| Suite | Root section | Cases | Result |
|---|---|---|---|
| Inline Add and Edit Parts | 6597 | 123 | **ALL CHECKS PASSED** (run 418 set-equal) |
| Printer Friendly Work Orders | 6617 | 44 | **ALL CHECKS PASSED** (run 419 set-equal) |
| Invoice UI Refresh | 6559 | 119 | **ALL CHECKS PASSED** (no run yet) |

Re-run any of them with the command in the file's first lines. Each run reads TestRail **live**;
these files are the record of a run, never a substitute for one.

**The NOTES matter as much as the pass.** Between them they carry: C45220 is Vladimir Tomovic's and
is reported on five checks and edited on none · 30 Invoice cases are Mudassir Qamar's and are IN
SCOPE, not foreign · four Invoice cases hold the Rule-69 NOT-BUILT marker legitimately · and the
Inline and Printer build sentences still name `v26.35.6-598cc8a` while the branch now serves
`v26.35.6-0f8d60b`, so those stamps are one build stale (Rule 91).
