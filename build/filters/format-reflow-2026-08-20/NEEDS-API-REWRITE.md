# FILTERS — cases needing API rewrite BEFORE reflow (2026-08-20)

DANGER variant (coordinator warning 2026-08-20): these cases store line breaks as raw \n
INSIDE a <p> block with NO <br>. The TestRail UI Edit→"."→Save collapses those \n into
spaces, producing a single RUN-ON line with the AUTOMATION marker inline — WORSE than before,
and the "." reflow CANNOT fix it. They are SKIPPED by the reflow driver and listed here so they
can be rewritten via API into clean <br> form first, then reflowed. NOT TOUCHED by this run.

