# Dashboard — held "not yet built" tests build-verified, 13 Oct 2026
QA lead: Ayesha believes the held tests are now built — *"check those test cases and build verify them and correct them if
needed"*; *"ALl these test cases need to be made Automation: Ready if they are ready for automation."*
- All 15 were held for one reason: design row 15 (grey "-" and the empty-chart outline), per the authoring notes
  (`origin/claude/slack-session-setup-7v5itm:build/dashboards/full-update-2026-10-07/FULL-UPDATE-2026-10-07.md`).
- Observed on sv490 v26.40.8-754bd3a (screens only, no test run): both are built — see `probe/` and
  `build/dashboard/OBSERVED-UI-LABELS-sv490.md` (2026-10-13). Labels the steps use re-observed on this build.
- 14 tests (created by us): marker → `Last checked against build v26.40.8-754bd3a on 10/13/2026.` + `AUTOMATION: READY`
  (`flip_ready.py`, `write-log.txt`); nothing else changed; display fr-view 14/14; check_tester_runnable PASS;
  check_runnable_cases clean.
- C88606: Automated + E2E, last edited by Nebojsa — NOT changed (Rule 71); same reason, also built; QA lead to decide.

## Second set (QA lead: "Just work on those tests which are having Automation: Hold when they are actually Not")
- C88606: QA lead "No" — stays on hold. C88631 (not manually testable) — the reason still holds, left.
- The 12 "HOLD - not yet build-verified" tests: every screen their steps use observed on v26.40.8-754bd3a
  (probe/07–11; labels in OBSERVED-UI-LABELS-sv490.md). Marker → stamp + `AUTOMATION: READY` (`flip_ready2.py`,
  `write-log-2.txt`). C351704 step 2 reworded to the Issue Credit window's labels (same step count). Expected untouched.
  Display fr-view 12/12; check_tester_runnable PASS; check_runnable_cases: only C351724 R3, unchanged from before.
