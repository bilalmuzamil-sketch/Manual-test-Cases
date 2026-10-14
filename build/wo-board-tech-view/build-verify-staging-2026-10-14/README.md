# WO Board & Tech View — 6 updated/new tests build-verified on STAGING, 14 Oct 2026
QA lead: build verify only (do not cross the lane), on staging (feature now on staging). Tests (run 498):
C154648 (test 3481974) · C368133 (3761654, AUTOMATED — not changed) · C96965 (3481909) · C581889 (3973195) ·
C581890 (3973196) · C581891 (3973197).
- Observed: every screen/label the steps use (OBSERVED-UI-LABELS-staging.md, 2026-10-14). Screens only; no test run.
- Changes on the 5 non-Automated tests (`apply.py`, `write-log.txt`): stamp `Last checked against build v26.40.17-ddb9ba1
  (staging) on 10/14/2026.`; marker READY (3 were HOLD not yet build-verified); preconditions name Asset on Site
  ("shows no choice; if its chip shows Yes or No, click the x"). Steps and Expected unchanged.
- Checks: display fr-view 5/5; check_tester_runnable PASS; check_runnable_cases flags only the authors' own "Read the
  board." / "Read its Technicians." steps (untouched).
- C368133 (Automated): same stamp + Asset on Site line applied after the QA lead's YES (14 Oct); he passes it to the automation engineer. Open: the setup Docs' "What must be
  true" lists do not yet carry the Asset on Site line.

## Second set — 8 tests (run 498), 14 Oct 2026
QA lead: "Lets Build verify them on staging now". Tests: C96970 (test 3481914) · C368133 (3761654) · C96965 (3481909) ·
C581892 (3974848) · C581893 (3974849) · C581894 (3974850) · C581895 (3974851) · C581896 (3974852).
- Observed on staging v26.40.17-ddb9ba1: every screen/label the preconditions, steps and setup Docs use (probe/10-13;
  OBSERVED-UI-LABELS-staging.md "second set"). Screens only; no test run, no data built, no write during probes.
- TestRail (`apply2.py`, `apply3.py`, `write-log.txt`, `before/`): stamp + READY on C96970, C581892–C581896 (five were HOLD
  "not yet build-verified"); C581895 preconditions "Lead technician name" → "Lead technician" (the Fields to display item);
  C581896 example site address → staging; C96970 two steps "Read where {Work-order-2} is." → "Read which column … is in." /
  "Read which group … is in." (gate R4: nothing to aim at). Expected wording unchanged everywhere.
- C368133 and C96965 not written: since the first pass only their source note changed (PRD v49); stamp still current.
- Setup Docs (Google): Entire work order steps now say "under Schedule choose Specific hours…" before the Hours − / +
  (C96965, C368133, C581893); Choose lines steps now say "click the Create shift button (it reads, for example, Create
  shift · 1 line · 2h)" (C96965, C368133, C581891, C581892 incl. the 2-line step); C581895 "Lead technician"; C581896
  example address staging. All read back.
- Checks: display fr-view 8/8 (served-8.json, served-96970.json); check_tester_runnable PASS 8/8; check_runnable_cases 8/8.
- Not seen (outside lane, no import made): the message after a successful invoice import, quoted in the C581896 Doc.
- Out of scope, same wording issue: the C368132 setup Doc still says "click Create 1 shift" in Choose lines mode.
