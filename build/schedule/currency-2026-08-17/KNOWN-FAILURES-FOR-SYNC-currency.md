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


### SCH-NAV-01 = [C29925](https://shopview.testrail.io/index.php?/cases/view/29925)
- **Prior marker:** `AUTOMATION: READY`


### SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)
- **Prior marker:** `AUTOMATION: READY`


### SCH-NAV-04 = [C29928](https://shopview.testrail.io/index.php?/cases/view/29928)
- **Prior marker:** `AUTOMATION: READY`


### SCH-NAV-05 = [C29929](https://shopview.testrail.io/index.php?/cases/view/29929)
- **Prior marker:** `AUTOMATION: HOLD - the control this test needs does not exist in this build; a ticket cannot be raised yet`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you will find on the build as it stands: clicking a department group header does nothing at all - the technician rows stay where they are. There is no arrow or chevron on the header to click either. This has been checked in both week and day view, on every department header on the page, and it behaves the same way every time.
  > Please mark this test BLOCKED, not failed, and do not raise a new problem for it - it is already written up and is waiting to be reported.


### SCH-NAV-06 = [C29930](https://shopview.testrail.io/index.php?/cases/view/29930)
- **Prior marker:** `AUTOMATION: READY`


### SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MCAL-02 = [C29933](https://shopview.testrail.io/index.php?/cases/view/29933)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MCAL-03 = [C29934](https://shopview.testrail.io/index.php?/cases/view/29934)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MCAL-04 = [C29935](https://shopview.testrail.io/index.php?/cases/view/29935)
- **Prior marker:** `AUTOMATION: READY`


### SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)
- **Prior marker:** `AUTOMATION: READY`


### SCH-WOL-05 = [C29940](https://shopview.testrail.io/index.php?/cases/view/29940)
- **Prior marker:** `AUTOMATION: READY`


### SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)
- **Prior marker:** `AUTOMATION: READY`


### SCH-FILT-01 = [C29942](https://shopview.testrail.io/index.php?/cases/view/29942)
- **Prior marker:** `AUTOMATION: READY`


### SCH-FILT-02 = [C29943](https://shopview.testrail.io/index.php?/cases/view/29943)
- **Prior marker:** `AUTOMATION: READY`


### SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)
- **Prior marker:** `AUTOMATION: READY`


### SCH-FILT-04 = [C29945](https://shopview.testrail.io/index.php?/cases/view/29945)
- **Prior marker:** `AUTOMATION: HOLD - the Priority filter this test needs does not exist in this build; a ticket cannot be raised yet`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you will find on the build as it stands: the Filters panel has no Priority section at all, so there is no High, Medium or Low to choose at step 2. The whole panel reads: Unassigned, Assigned, Approved, Declined, In Progress, Ready for Review.
  > Please mark this test BLOCKED, not failed, and do not raise a new problem for it - it is already written up and is waiting to be reported.


### SCH-FILT-05 = [C29946](https://shopview.testrail.io/index.php?/cases/view/29946)
- **Prior marker:** `AUTOMATION: READY`


### SCH-FILT-06 = [C29947](https://shopview.testrail.io/index.php?/cases/view/29947)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-01 = [C29948](https://shopview.testrail.io/index.php?/cases/view/29948)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-05 = [C29952](https://shopview.testrail.io/index.php?/cases/view/29952)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-06 = [C29953](https://shopview.testrail.io/index.php?/cases/view/29953)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LINE-07 = [C29954](https://shopview.testrail.io/index.php?/cases/view/29954)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-02 = [C29956](https://shopview.testrail.io/index.php?/cases/view/29956)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-03 = [C29957](https://shopview.testrail.io/index.php?/cases/view/29957)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-05 = [C29959](https://shopview.testrail.io/index.php?/cases/view/29959)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-07 = [C29961](https://shopview.testrail.io/index.php?/cases/view/29961)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)
- **Prior marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8957)`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you should see today: there is no click alternative anywhere. The work order card in the left-hand panel carries no button that arms it for placing - not when the page loads, not when you rest the mouse on the card, and not inside the card's line list. The only way to place a job on the grid is to drag it. This is a known problem and it is already reported - see https://shopview.atlassian.net/browse/SV-8957. That ticket has been closed without the problem being fixed, so do not wait for a fix.
  > - If you see exactly that, mark this test FAILED and do not raise anything new.
  > - If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
  > - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.


### SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SCOPE-02 = [C29964](https://shopview.testrail.io/index.php?/cases/view/29964)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SCOPE-03 = [C29965](https://shopview.testrail.io/index.php?/cases/view/29965)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967)
- **Prior marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8886)`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you should see today: Ticking lines does switch the rows into tick boxes and the bar at the bottom does count what you have ticked, but it reads '2 selected - 4h' rather than the wording above, there is no 'Select all' button anywhere, and there is no 'Cancel'. The only 'All' control is the 'All <number of lines>' chip higher up, which filters the list and ticks nothing. To leave tick-box mode you have to press 'Select multiple' a second time, and nothing on screen tells you that. This is a known problem and it is already reported - see https://shopview.atlassian.net/browse/SV-8886.
  > - If you see exactly that, mark this test FAILED and do not raise anything new.
  > - If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
  > - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.


### SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969)
- **Prior marker:** `AUTOMATION: READY`


### SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)
- **Prior marker:** `AUTOMATION: READY`


### SCH-START-04 = [C29972](https://shopview.testrail.io/index.php?/cases/view/29972)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SPREAD-02 = [C29978](https://shopview.testrail.io/index.php?/cases/view/29978)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SPREAD-06 = [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)
- **Prior marker:** `AUTOMATION: READY - EXPECT FAIL (SV-9090)`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you should see today: There is no start date anywhere in the window, so step 2 cannot be carried out at all. The run of days always begins on the day you dropped the work order on. Check all five choices in the 'Schedule' dropdown before you mark it: 'Until a date...' adds a 'Finish by' date and 'Specific hours...' adds an hours stepper, but both of those set where the run ENDS, not where it begins. This is a known problem and it is already reported - see https://shopview.atlassian.net/browse/SV-9090. That ticket has been closed without a fix, so do not wait for one.
  > - If you see exactly that, mark this test FAILED and do not raise anything new.
  > - If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
  > - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.
  > 
  > The same problem was also reported earlier as SV-8855, which is closed too.


### SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)
- **Prior marker:** `AUTOMATION: HOLD - an observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker`
- **Removed build-observation paragraph (re-verify at the sync):**

  > What you should see today: Points 1 and 3 are fine - confirming created one shift per working day, all joined into one series, each keeping its own day and hours, and weekends were skipped. Point 2 looked right on the grid but was not examined closely, so check the connected banner yourself. Point 4 is not: no message with an Undo button appeared after confirming. This has been checked on the build and reported to the QA lead, but it does not have a ticket number yet.
  > - If you see exactly that, mark this test FAILED and say it is the known problem with no ticket yet.
  > - If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
  > - If it PASSES, tell the QA lead: it means this was fixed after 12 August 2026.


### SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SER-01 = [C29987](https://shopview.testrail.io/index.php?/cases/view/29987)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SER-02 = [C29988](https://shopview.testrail.io/index.php?/cases/view/29988)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SER-03 = [C29989](https://shopview.testrail.io/index.php?/cases/view/29989)
- **Prior marker:** `AUTOMATION: READY`


### SCH-SER-04 = [C29990](https://shopview.testrail.io/index.php?/cases/view/29990)
- **Prior marker:** `AUTOMATION: READY`


### SCH-BLOCK-01 = [C29991](https://shopview.testrail.io/index.php?/cases/view/29991)
- **Prior marker:** `AUTOMATION: READY`


### SCH-BLOCK-02 = [C29992](https://shopview.testrail.io/index.php?/cases/view/29992)
- **Prior marker:** `AUTOMATION: READY`


### SCH-BLOCK-05 = [C29995](https://shopview.testrail.io/index.php?/cases/view/29995)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LANE-01 = [C29996](https://shopview.testrail.io/index.php?/cases/view/29996)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LANE-02 = [C29997](https://shopview.testrail.io/index.php?/cases/view/29997)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)
- **Prior marker:** `AUTOMATION: READY`


### SCH-LANE-04 = [C29999](https://shopview.testrail.io/index.php?/cases/view/29999)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DAY-03 = [C30003](https://shopview.testrail.io/index.php?/cases/view/30003)
- **Prior marker:** `AUTOMATION: READY`


### SCH-DAY-06 = [C30006](https://shopview.testrail.io/index.php?/cases/view/30006)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MODAL-01 = [C30008](https://shopview.testrail.io/index.php?/cases/view/30008)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)
- **Prior marker:** `AUTOMATION: READY`


### SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)
- **Prior marker:** `AUTOMATION: READY`

