# WO Board & Tech View, run 498 — build verification on STAGING, 16 Oct 2026 (evening pass)
QA lead: "build verify ALL the test cases which are not yet build verified" → scope "Only the 50 never checked", "Without
re-reading" the requirement, writing session finished; later "Yes for automated tests". Lane: labels / routes / setup only.
Builds: staging redeployed during the pass (v26.40.19-edc8195 → v26.40.19-1493c63); stamps name 1493c63, the build the final
probes ran on. Scope (live, paged): scope-run498.json (278 tests), scope-50.json. Snapshots: before/. Labels: ../OBSERVED-UI-LABELS-staging.md.

## Written (apply.py, apply2.py, apply3.py → write-log.txt; all verify=OK)
- READY + "Last checked against build v26.40.19-1493c63 (staging) on 10/16/2026.": C96927 C96975 C96979 C97020 C97021 C368150
  C614719 C368151 C614714 C590110 C590112 C590114 C590117 C590119 C590120 C590122 C590128 C590129 C590131 C614716 C96956 C368240
  C368215 · Automated (QA lead's yes): C96929 C97011 C96945 C97007 C368144 C96978.  C614711 keeps READY - EXPECT FAIL (SV-11416) + stamp.
- Not available on Build to test Yet (Rule 69; replaced READY or no marker): Technician filter C581915 C581916 C581917 C581918 C97022;
  Work Orders tab has no Status filter C96916, C368214 (Automated); New Work Order window has no Lead Technician field and no
  split-line C368145 (Automated).
- HOLD added (had no marker): C368191 — needs a line whose labour belongs to a deleted staff member; staging has none.
- Wording to the build: C96956 (second location example → Staging Lethbridge - 4310; confirm button named Reassign), C97007 and
  C368144 (Reassign), C96978 (List's Column Selection has no On Site), C368240 (location via initials > Change Location),
  C368215 (build line names staging; sign-in), 14 cases' role line names the Admin role's Work orders permissions, C368151/C590120
  source paragraph moved from setup into Expected under the provenance heading, C590114 says how to make the Invoiced work order.
- Morning-held C368130, C368158 stamped (v26.40.19-72f4f3b, their check this morning) once their setup Docs were fixed.
- Setup Docs fixed: C590112 C96956 C96979 C590129 C590131 C368158 C368130 C96975; C96927's morning edit reverted (the new build
  lists On Site and Unit in Tech View's Column Selection, so the original wording is right again).
Gates: check_tester_runnable PASS 32/32 · check_runnable_cases 32/32 · served display fr-view 41/41 (served-41.json).

## Left held, with the reason still true on 1493c63
C590127 (Technician filter; HOLD, Rule 69 marker may not replace it) · C368152 (no Unassign menu item) · C614717 (the "+N" bubble
not seen on screen this pass) · C614715 (no location without any work orders) · C368197 (List has no pages) · C368238 C368239
(no on-screen way to start account access) · C368175 C154650 (second organization) · analytics C97023 C97024 C97025 C97027 C97029
C97035 C368153 C368155 (not hand-testable; the run session handles them).
