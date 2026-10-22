# Worker brief: apply Rule 136 to every case of this suite (22 Oct 2026)

QA lead, 22 Oct 2026, confirmed "Yes, record and apply": Rule 136 (end of `build/rules/RULES-61-96.md`, read it in full first, with
Rules 114, 117 (all amendments), 127, 134, 135 and `build/skills/IDEAL-TEST-CASE-STANDARD.md`, `build/LESSONS-REGISTER.md`).

You DRAFT only: edit this suite's authoring files and run the gates. No writes to TestRail, Jira, Slack or Google; no commits. Work
only inside this suite's folder.

## What to do, for EVERY case of the suite
1. **Split** (Rule 136 §1-§4) where every part checks a different behaviour, starts from its own preconditions without another case run
   first, and has no result depending on another part's steps. **Never** split where a later step checks an earlier one's effect (save
   then reload, undo, before/after with a captured value, ordering across actions, two tabs or two users on the same record, a change
   then the log entry it makes). When in doubt, keep it whole. The original key keeps its C-id as the first part (its title may change to
   name that part); every other part is a NEW key (e.g. "<key>b", "<key>c" — check the build accepts the format) in the same section.
   Each part is a complete case: its own title (≤80, no semicolons, "Design: " for design cases), preconditions with {placeholders} and
   "For example" lines, steps, one "Step N:" result per step, only the quotes and From lines that back ITS results, design references,
   marker, refs, setup recipe. Where an earlier part changes data a later part needs, the later part gets its own records; otherwise
   reuse the same seeded records.
   Check especially the long cases (11-15 steps) the last pass listed, and any case whose results check several requirements.
2. **Shorter but runnable** (Rule 136 §5): fold a step that only reads/looks at what the previous action produced into that action's
   "Step N:" result; keep a reading step that itself needs an action (open a file, scroll, switch tab, hover). Move state the case does
   not test into the preconditions (starting screen, filters already set, records in place). Rule 135 still holds: one action per step,
   no unnecessary steps, never at the cost of runnability.
3. Rule 134: every changed or new case rewritten top to bottom against all current sources; quotes stay word for word.
4. Run the build (0 PROBLEM lines), regenerate the setup file and outputs, and re-run a scan: no step with two or more UI actions, no
   pure read-only step left after an action (list any kept, with the reason).

## Output (this folder)
- `SPLITS.json`: {"<original key>": {"case_id": "...", "parts": ["<key>", "<key>b", ...], "why": "..."}} for every split, and
  "NOT-SPLIT" entries with the reason for every case over 8 steps that stays whole.
- `PASS-REPORT.md`: every changed case (key, C-id or "new"), steps before → after, what was folded/moved/split, and the per-part record
  (title / preconditions / steps / results / quotes / From lines / design block / notes / marker / refs / setup: CHANGED or CONFIRMED).
- Final message: cases split (into how many), new cases, cases shortened, total steps before → after, gate output.
