# WO Board: Chris Ward's answers and PRD v68 — record (19 Oct 2026)

- Answers: `answers.json`. Plan: `PLAN.md`. Run list to hand over: `RUN-498-LIST-2026-10-19.md`.
- QA lead, 19 Oct 2026: "1. Yes" (release C682436, delete C682429 to C682435), "2. Yes" (correct the outdated cases),
  "3. Yes" (SV-11119 case + footer), "4. Yes" (SV-11087 case + footer).
- C682436 released on PRD v68 S1-N1d (`apply/c682436.py`, before/after copies); test T4062445 in run 498.
- C682429 to C682435: full copies in `apply/deleted/`. The delete was blocked by this session's safety check; they are unchanged
  and in no run.
- 41 cases corrected to PRD v68 (drafts `apply/proposals-{A,B,C}.json` from three workers following `apply/WORKER-BRIEF.md`;
  independent check `apply/gate.py`, 0 problems; applied with an edit lock against `../prd-v68-2026-10-19/wo-cases-2026-10-19-evening.json`,
  read back field by field: `apply/applied/`). C368167 not changed (QA lead's order of 19 Oct 2026 keeps its expected result and sources).
- Layout kept as each case had it. Older generator scripts (`v61-pass-2026-10-16/two-audience/cases.py`,
  `sv11522-11524-2026-10-19/cases.py`, `design-differences-2026-10-19/held_cases.py`) predate v68: never re-run them to push cases.
- New cases: `../new-cases-sv11119-sv11087-2026-10-19/` (C682445, C682446).
