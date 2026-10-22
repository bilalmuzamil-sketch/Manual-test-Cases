# Worker brief: A/R and A/P suite — full pass against the tech plan (22 Oct 2026, Rule 134)

QA lead, 22 Oct 2026 (verbatim): "And here are the tech plans, make sure that you Check if ANY of the test cases you created needs to be
changed/edited/retired based on them anything that needs to be changed in the test cases from top to the bottom of those test cases if
required should be done. It has happened in the past that you have edited the part of the test case where full case or more than that
just part of the case was required to be updated. Make it a rule to NEVER repeat such mistakes."

You DRAFT only: edit authoring files inside `build/ar-ap-report-sorting/` and run the gates. No writes to TestRail, Jira, Slack or
Google; no commits.

## Read first, in full
- **Rule 134** (end of `build/rules/RULES-61-96.md`; it is the reason for this pass), Rules 30, 41, 57, 96, 113, 114, 115, 116, 117 (all
  twelve amendments), 122, 130; `build/LESSONS-REGISTER.md` (L-01 to L-06); `build/skills/IDEAL-TEST-CASE-STANDARD.md`.
- **The tech plan**, every line (Rule 119): `sources/Tech-Plan-AR-AP-2026-10-22-upload.md` (88,174 bytes, 646 lines). Record reading
  coverage (line ranges, 100%).
- PRD v5 `sources/CONFLUENCE-947650561-v5-2026-10-22.md` and the design pass outputs in `design-2026-10-22/` as context; Chris Ward's
  questions 1-15 (`questions-2026-10-22/sheet_rows.py`, `design-2026-10-22/NEW-QUESTIONS.py`), none answered yet.

## What to do
1. List every testable statement the tech plan makes (behaviour, messages, limits, permissions, error/empty/loading states, migration or
   release-day effects, performance limits a tester can observe, anything about what must not change). For each: CONFIRM (already a
   case: name it) / ADD (author a case cited to the tech plan, quoted word for word, as its own "From:" document: "Tech plan "<title>"
   (<date in the file>, uploaded 22 Oct 2026)") / DIVERGE (the plan conflicts with PRD v5, a PO answer or the design: the case follows the
   PRD; draft a plain question for Chris, Rule 96/130). The plan never overrules the PRD (Rule 30).
2. **Check EVERY one of the 289 cases** (authoring `cases_*.py`; C-ids in `testrail-id-map.csv`) against the plan. Verdict per case:
   CONFIRMED / CHANGE / RETIRE / NEW CASE NEEDED, with the reason. **A case that changes is rewritten top to bottom** (Rule 134 point 2):
   title, every precondition and "For example", every step, every result, quotes and "From:" lines, build line, References from Design,
   notes, marker, refs, setup recipe. Where the plan gives a fact a tester needs (an exact label, a limit, where a control sits, a
   permission name), use it. A case the plan proves wrong: RETIRE (list it, do not delete) or rewrite.
3. New cases go in the right section (S1-S9, DATA, REL, DESIGN) with new keys; must-not-change items the plan reveals go in REL.
4. Draft new questions for Chris in `tech-plan-pass-2026-10-22/NEW-QUESTIONS.py` (same ROWS shape, numbered from 16; skill 07 §6 first:
   drop anything our own sources answer). Held cases for open questions use `AUTOMATION: HOLD - waiting on the PO (question N: …)` and
   stay out of the run.
5. Run `python3 authoring/build.py` (0 PROBLEM lines), regenerate setup file and outputs.

## Output
- `tech-plan-pass-2026-10-22/TECH-PLAN-STATEMENTS.md` (every testable statement, verdict, case keys), `PASS-REPORT.md` (**every one of
  the cases, one row each: key, C-id, verdict, and for CHANGE the per-part record title / preconditions / steps / results / quotes /
  From lines / design block / notes / marker / refs / setup — each CHANGED or CONFIRMED** — plus RETIRE list and new cases),
  `READING-RECORD.md`, `NEW-QUESTIONS.py`.
- Final message: counts per verdict, the retire list, new cases, new questions, divergences, gate output.
