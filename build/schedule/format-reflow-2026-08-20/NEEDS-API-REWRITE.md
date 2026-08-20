# SCHEDULE — cases needing API rewrite BEFORE reflow (2026-08-20)

DANGER variant (coordinator warning 2026-08-20): these cases store line breaks as raw \n
INSIDE a <p> block with NO <br>. The TestRail UI Edit→"."→Save collapses those \n into
spaces, producing a single RUN-ON line with the AUTOMATION marker inline — WORSE than before,
and the "." reflow CANNOT fix it. They are SKIPPED by the reflow driver and listed here so they
can be rewritten via API into clean <br> form first, then reflowed. NOT TOUCHED by this run.

- [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) — field(s) steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) — field(s) steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=4)
- [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=4)
- [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=4)
- [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=4)
- [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=4)
- [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
- [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) — field(s) preconds/steps store line breaks as raw \n inside <p> with NO <br>; the "." reflow would collapse them into a run-on line. Rewrite via API into <br> form first, then reflow. (atm=1)
