# Parts Lifecycle — six new tests (C913767-C913772) build-verified on v26.45.0-2c807b5, 4 Nov 2026

Written 4 Nov 2026 by the test-writing session for PRD v36 (S6-R5, S11-R3c, S13-R19a) and SV-12010; handed over by the QA lead the same day.

- C913767, C913768, C913769, C913770: every step's label seen on this build (probes 32-35 in ../check-9-2026-11-04/probe, 36-37 here):
  Inventory search and Total Qty sort; three-dot → Cycle count, count toolbar (printer icon, Save, Cancel), three-dot back after Cancel;
  Part Library entry page, Edit Library Part, disabled Delete + hover text; Edit Inventory Part with Delete Part; a part request picked
  from the "Part Library" result saves as "Auth To Order" with an Order button (Lines tab and Parts tab); Purchase Orders list.
  apply4.py: "dimmed (disabled)" → "disabled" (C913768, C913769), build line, marker READY. C913770 step "Open work order 1." given its
  route. write-log.txt: 5/5 verify=OK.
- C913771, C913772: untouched, held. SV-12010 is in Board Backlog (read 4 Nov 2026) and the branch has no commit for it.
- Note: the Total Qty sort fix (SV-12105) has no commit on the branch yet; C913767's part B (bins 5 and -3) is the case it covers.
- Checks: tester-runnable PASS; runnable 4/4 after the step fix; display 6/6 fr-view, C913770 rescanned after its step edit.
