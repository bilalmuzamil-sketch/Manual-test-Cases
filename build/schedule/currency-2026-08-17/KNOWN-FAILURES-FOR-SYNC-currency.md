# KNOWN FAILURES / OBSERVATIONS to re-establish at the build-verify sync — currency pass 2026-08-17

Whole-suite v27→v30 currency pass. **Build verification DEFERRED** (Rule 69): the app was NOT opened,
`quick-login`/`switch-user` were never called. All 148 v27 cases were re-pinned to spec v30 and set to
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`, matching the 47 cases the
Fabian pass already brought to v30 (whole suite now uniform).

In doing so, **prior build-observation / expect-fail / HOLD-reason context was removed** from the
tester-facing text (it named a superseded build v3.5-d122eef / v3.5-65d6500 or v27 expectations).
It is preserved below so the later build-verify sync re-checks each against the live build and re-adds
the right marker (Rule 61) — READY, READY - EXPECT FAIL (SV-xxxx), or a genuine HOLD.

**No ticket created or closed this pass (Jira creation hold active). Nothing below is a current build
fact — each is a *previously observed* item to re-verify.** Cases below list only those that carried a
stripped build-observation paragraph or a non-plain prior marker (HOLD / EXPECT-FAIL).

### SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DEL-02 = [C30058](https://shopview.testrail.io/index.php?/cases/view/30058)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MODAL-06 = [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)
- **Prior marker:** `AUTOMATION: HOLD - an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker`


### SCH-START-05 = [C29973](https://shopview.testrail.io/index.php?/cases/view/29973)
- **Prior marker:** `AUTOMATION: HOLD - the Unassigned row does not exist in the build, so this cannot be run`


### SCH-START-06 = [C29974](https://shopview.testrail.io/index.php?/cases/view/29974)
- **Prior marker:** `AUTOMATION: HOLD - the Unassigned row does not exist in the build, so this cannot be run`

