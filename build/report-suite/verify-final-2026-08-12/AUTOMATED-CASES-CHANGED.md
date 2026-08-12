# Automated cases changed — none

**No case was changed in this pass**, so no automated case was affected.

`custom_atmstatus` was never set on any case. The 40 flagged Report Suite cases belong to
Vladimir Tomovic and were not read into any write set; all 12 of his cases under group 4281 are
untouched.

Had the prepared changes been applied, the three cases involved
([C30107](https://shopview.testrail.io/index.php?/cases/view/30107),
[C43591](https://shopview.testrail.io/index.php?/cases/view/43591),
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913)) would each have moved from
`AUTOMATION: READY` to `AUTOMATION: HOLD`, which **lowers** the ready-to-automate figure by 3. That
is the correct direction: all three name something the build cannot currently do.
