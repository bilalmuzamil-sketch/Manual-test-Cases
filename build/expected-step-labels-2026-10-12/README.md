# Step labels on Expected results — ONE-TIME job (QA lead, 12 Oct 2026). Not a rule, not a skill.
QA lead: *"under the expected result you must mention the Step - N to tell this is the expected result of which Step
you followed"*; scope *"These two and 70 dashboard tests too"* (C368136, C96960 + the 70 Dashboard tests).
- Adds ONLY "Step N: " / "Steps a, b and c: " / "Steps a to b: " in front of each bullet of the Expected results list
  (`labels.py`, maps in `map/`). Wording, source block, stamp and AUTOMATION marker byte-identical (checked by exact
  inverse on every write). A bullet that already names its step in its own words is left as is (C88635, C88640 first bullet).
- Done: C368136, C96960 (written, display fr-view); Dashboard trial C88601, C88635, C351706 (written, display fr-view).
  QA lead OK on the trial ("Yes please"): remaining 67 Dashboard written. All 72 re-read live: removing the labels gives
  back the earlier Expected exactly; Steps, Preconditions, title and automation fields unchanged; display fr-view 72/72.
