# FILTERS — cases needing API rewrite BEFORE reflow (2026-08-20)

DANGER variant (coordinator warning 2026-08-20): these cases store line breaks as raw \n
INSIDE a <p> block with NO <br>. The TestRail UI Edit→"."→Save collapses those \n into
spaces, producing a single RUN-ON line with the AUTOMATION marker inline — WORSE than before,
and the "." reflow CANNOT fix it. They are SKIPPED by the reflow driver and listed here so they
can be rewritten via API into clean <br> form first, then reflowed. NOT TOUCHED by this run.

- [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) — field(s) steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C43590](https://shopview.testrail.io/index.php?/cases/view/43590) — field(s) steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) — field(s) preconds store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
