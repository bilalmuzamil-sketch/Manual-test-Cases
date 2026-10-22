# Worker brief: one action per step (22 Oct 2026)

QA lead, 22 Oct 2026, chose "Yes, fix all 113 cases": our standard says each step is ONE action, but some steps bundle two or three
("Click the field and click Unassigned"; "Open the staff record, turn the switch off and save"); when one fails the tester cannot tell
which part went wrong. A scan flagged the steps listed in `FLAGGED-STEPS.json` (this folder): every step with two or more UI actions.

You DRAFT only: edit this suite's authoring files and run the gates. No writes to TestRail, Jira, Slack or Google; no commits. Work
only inside this suite's folder (`build/<suite>/`).

## Read first, in full
Rule 134 and Rule 117 (all twelve amendments) in `build/rules/RULES-61-96.md`; Rule 41; `build/skills/IDEAL-TEST-CASE-STANDARD.md`;
`build/LESSONS-REGISTER.md` (L-01 to L-07).

## What to do
1. For every case in `FLAGGED-STEPS.json`, and every other case of the suite that has a step with two or more UI actions (re-scan the
   whole suite yourself; also look for shared step helpers in `common.py` / `cases_*.py` that bundle actions, e.g. one constant that
   opens a report, sets the date range and turns columns on — split the helper and fix every case that uses it):
   - split each bundled step into single actions, in the same order, in the screen's own words;
   - give every step exactly one "Step N:" result: the result the old step had goes on the step that produces it; a new
     intermediate step gets a plain, observable result (e.g. "Step 3: the menu opens."), never an invented behaviour — anything a
     result claims must follow from the case's quotes or be a neutral observation of the action just done;
   - keep an action and the reading of its outcome together only when the reading is the result of that same step (e.g. "Open the
     PDF." then the result says what it shows) — never two clicks, a click and a save, or a click and a reload in one step.
2. Rule 134: every case you change is re-checked top to bottom against all current sources and its other parts kept correct (title,
   preconditions and "For example", results, quotes and From lines unchanged unless wrong, design block, notes, marker, refs, setup
   recipe). Quotes stay word for word.
3. Do not change any case that needs no step split. Do not change titles unless a title is now wrong.
4. Run the suite's build (`python3 authoring/build.py`, 0 PROBLEM lines) and regenerate the setup file and outputs.
5. Re-run your own scan at the end: zero steps with two or more UI actions left (list any you judge must stay, with the reason).

## Output (this folder)
- `PASS-REPORT.md`: every changed case (key, C-id), steps before → after (count), and the per-part record (title / preconditions /
  steps / results / quotes / From lines / design block / notes / marker / refs / setup: CHANGED or CONFIRMED).
- Final message: cases changed, steps before → after in total, anything left and why, gate output.
