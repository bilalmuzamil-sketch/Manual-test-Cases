# WO Board and Tech View design cases: new titles (19 Oct 2026)

QA lead, 19 Oct 2026: every WO Board / Tech View design case gets the easiest title for a lay person. Cases made
before today start "Design: "; cases made today start "Design- ". Title only; nothing else changes.

- Scope: TestRail section 73780 "Design — how it looks" (group 13204). 37 cases, all ours (created_by 3).
- Changed: 36 titles (25 "Design: ", 11 "Design- "), updated with an edit lock, read back field by field. Only the title
  and TestRail's own version counter changed (`applied/log.json`, `applied/after-cases.json`; before-copy `before/design-cases.json`).
- Held: C682420 (TestRail marks it Automated, Rule 71). Proposed title in `titles.py`; waiting for the QA lead's go-ahead.
- Test runs show the case title, so run 498 shows the new titles; no run change was needed.
- The new titles were copied into the live files: WO-BOARD-SETUP-FILE.md and the case scripts (v61 two-audience
  `cases.py`, `held_cases.py`, ticket-sweep `cases.py`, `new_case_sv11503.py`), so a re-run cannot bring old titles back.
  Older snapshots and reports keep the old titles as history.
