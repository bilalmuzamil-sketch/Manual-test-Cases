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
- Open: C368133 needs the same stamp + Asset on Site line (QA lead's go-ahead, Automated); the setup Docs' "What must be
  true" lists do not yet carry the Asset on Site line.
