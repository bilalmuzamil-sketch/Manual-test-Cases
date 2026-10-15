# WO Board & Tech View — "Design — how it looks" (section 73780, run 498) build-verified on STAGING, 15 Oct 2026
QA lead: "Lets do the build verification for the WO Dashboard and Tech view design test cases". Lane: labels/routes only; no test run, no data built.
Build: staging v26.40.17-a5c4210 (redeployed overnight; 14 Oct was ddb9ba1). 22 cases C590110–C590131, all ours, none Automated.
- Observed: probe/01–06 + 01-labels.json, 02-filter-check.json, 03-groups.json; labels in ../OBSERVED-UI-LABELS-staging.md (2026-10-15).
- Design pictures: every DC-*.png named in the preconditions is attached to its case (attachments-check.json; each is attached twice).
- TestRail (apply.py, apply2.py, write-log.txt, before/): all 22 — "nothing is chosen in any filter" now names the Asset on Site chip;
  C590110/C590113 "column chooser" → "Column Selection" (the on-screen name); C590116 "Sign out" → initials > Logout;
  C590122 step 2 names what to look at. 20 cases: provenance "Not yet checked against a build." → "Last checked against build
  v26.40.17-a5c4210 (staging) on 10/15/2026." and marker HOLD (not yet build-verified) → READY. Expected wording otherwise untouched.
- NOT stamped: C590125 (HOLD — product owner decision on the Dark theme; the profile menu does offer Light/Dark) and C590127
  (Technician filter not on this build — claim-technician-filter.json PROVED; Rule 69's not-available marker may not overwrite a
  HOLD, so its marker stays and the switch is put to the QA lead).
- Setup Docs (all 22): Asset on Site hint; review step now "click the Finance tab and click Mark Reviewed; in the Mark as reviewed
  window fill Mileage or Engine Hours if asked and click Confirm review" (C590114, C590120, C590121, C590123).
- Checks: check_tester_runnable PASS 22/22; check_runnable_cases 22/22; display fr-view 22/22 (served-22.json). C590114's expected
  flags LITERAL-TAGS: a verbatim design-code quote in its source note (pre-existing, Expected wording not ours to change).
