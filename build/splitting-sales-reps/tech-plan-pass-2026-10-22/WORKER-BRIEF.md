# Worker brief: Splitting Sales Representatives suite — full pass against the tech plan (22 Oct 2026, Rule 134)

QA lead, 22 Oct 2026 (verbatim): "And here are the tech plans, make sure that you Check if ANY of the test cases you created needs to be
changed/edited/retired based on them anything that needs to be changed in the test cases from top to the bottom of those test cases if
required should be done. It has happened in the past that you have edited the part of the test case where full case or more than that
just part of the case was required to be updated. Make it a rule to NEVER repeat such mistakes."

The tech plan uploaded today is byte-identical to the one uploaded 19 Oct (`sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md`,
278,939 bytes, 2,641 lines, dated 14 Oct, planned against PRD v8). The suite was built with it on 19 Oct, but the cases have changed a
lot since (PRD v10 and v11, Chris Ward's answers 1-40, the design re-check). So every case is checked against it again.

You DRAFT only: edit authoring files inside `build/splitting-sales-reps/` and run the gates. No writes to TestRail, Jira, Slack or
Google; no commits.

## Read first, in full
- **Rule 134** (end of `build/rules/RULES-61-96.md`), Rules 30, 41, 57, 96, 113, 114, 115, 116, 117 (all twelve amendments), 122, 130;
  `build/LESSONS-REGISTER.md`; `build/skills/IDEAL-TEST-CASE-STANDARD.md`. Note: for this suite the QA lead said the cases do NOT link
  the setup file (INTAKE-2026-10-19.md).
- **The tech plan**, every line, in chunks (Rule 119): record coverage. PRD v11 `prd-v11-2026-10-22/CONFLUENCE-919928833-v11-2026-10-22.md`
  (current; the plan was written against v8, so where they differ the PRD wins — Rule 30), Chris's answers
  `design-recheck-2026-10-20/chris-answers.json` (1-40), the report specs in `report-specs/`.

## The suite
- Authoring: `authoring/ssr_lib.py`, `common.py`, `cases_*.py` (129 cases), `build.py` (gates, 0 PROBLEM lines), `render_setup.py`.
- Plus 6 design-recheck cases NOT in the authoring library: C690658, C690659, C690660, C690661, C690663, C690664 (bodies in
  `design-recheck-2026-10-20/applied/C*-after.json`). Check them too; give any change as full new field values in
  `tech-plan-pass-2026-10-22/DR-PROPOSALS.json` ({"<id>": {"title","custom_preconds","custom_steps","custom_expected","why"}}).
- C-ids: `testrail-id-map.csv` (135 rows).

## What to do
1. List every testable statement the tech plan makes; for each: CONFIRM (case named) / ADD (new case cited to the plan, quoted word for
   word) / DIVERGE (conflicts with PRD v11 or an answer: the case follows the PRD; if not already ruled, draft a plain question for Chris).
   Many earlier divergences are already ruled (e.g. answer 7: the label stays "Sales representative"): check before drafting.
2. **Check EVERY case** against the plan, verdict CONFIRMED / CHANGE / RETIRE / NEW CASE NEEDED with the reason. **A case that changes
   is rewritten top to bottom** (Rule 134): title, preconditions and "For example", steps, results, quotes and "From:" lines, build line,
   References from Design, notes, marker, refs, setup recipe. RETIRE: list, never delete.
3. New questions for Chris: draft in `tech-plan-pass-2026-10-22/NEW-QUESTIONS.md` (plain words, options), numbered from 41 (his sheet
   17Ry1Bt… holds 1-40, all answered). Skill 07 §6 first.
4. Run `python3 authoring/build.py` (0 PROBLEM lines) and `python3 authoring/render_setup.py`.

## Output
- `tech-plan-pass-2026-10-22/TECH-PLAN-STATEMENTS.md`, `PASS-REPORT.md` (**every case, one row each: key, C-id, verdict, and for CHANGE
  the per-part record — title / preconditions / steps / results / quotes / From lines / design block / notes / marker / refs / setup —
  each CHANGED or CONFIRMED**; RETIRE list; new cases), `READING-RECORD.md`, `DR-PROPOSALS.json`, `NEW-QUESTIONS.md`.
- Final message: counts per verdict, the retire list, new cases, new questions, divergences, gate output.
