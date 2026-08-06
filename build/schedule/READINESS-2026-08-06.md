# Schedule — automation readiness, 6 August 2026

> **`READINESS-2026-08-05.md` is SUPERSEDED by this file** and is kept, not deleted.
> `READINESS-2026-08-04.md` is kept too. Neither is deleted; both describe builds that no longer exist.

## The one number

**140 of 168 cases can be handed to the automation engineer today.**

**The formula, written once:** every case carries exactly one machine-findable marker at the very end of
its Expected Results. **Ready to automate = the cases marked `AUTOMATION: READY` plus the cases marked
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`.** That is **119 + 21 = 140**. Equivalently, **168 minus the
28 marked `AUTOMATION: HOLD`**. Both arithmetics were read back from the live cases, not computed from
our notes.

## Read this before reading the table

**A case that says the product is wrong is a GOOD case.** It is not a shortfall and it is not something
to fix in the case. It is a case doing its job: it states what the documents require, the build does
something else, and a developer ticket exists. **It is expected to FAIL until that ticket is fixed**, and
it carries a plain block telling the tester exactly what they will see, that the failure is already
reported, and what to do if it fails in some *other* way instead. Those 21 cases are **ready to automate**
and are counted in the 140.

**What is NOT ready is only the 28 on hold** — and not one of them is on hold because the case is poor.
They are on hold because something we do not have is needed: a second sign-in as a different user, a
product owner's answer, a drag we could not perform through our tooling, or a feature that is not in the
build at all.

## Outcomes by area — every row adds up, and so does the total

| Area | Passes | Product is wrong | Held on the PO | Not built | Partly seen | Not seen | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| API — Schedule | 2 | 0 | 0 | 0 | 1 | 1 | **4** |
| Capacity Bars | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| Color System | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| Conflict Detection | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| Cross-Module and Rewrite Regression | 1 | 0 | 0 | 3 | 0 | 1 | **5** |
| Day View Timeline | 3 | 2 | 0 | 0 | 0 | 0 | **5** |
| Deletion, Series Scopes and Undo | 9 | 0 | 0 | 0 | 0 | 0 | **9** |
| Drag-and-Drop Scheduling | 6 | 2 | 1 | 0 | 0 | 0 | **9** |
| Edge Cases and Responsiveness | 3 | 3 | 1 | 0 | 0 | 0 | **7** |
| Events | 6 | 1 | 0 | 0 | 0 | 0 | **7** |
| Filter and Display and View Options | 5 | 3 | 0 | 0 | 0 | 0 | **8** |
| Grid Toolbar | 2 | 1 | 0 | 0 | 0 | 0 | **3** |
| Hover Tooltips | 3 | 2 | 0 | 0 | 0 | 0 | **5** |
| Keyboard Interactions | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| Linked Series and Banners | 3 | 1 | 0 | 0 | 0 | 0 | **4** |
| Multi-Day Spread Scheduling | 6 | 3 | 1 | 0 | 0 | 0 | **10** |
| Navigation and Layout | 5 | 2 | 0 | 0 | 0 | 0 | **7** |
| Overlap and Lane Stacking | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| Permissions | 2 | 0 | 0 | 0 | 1 | 10 | **13** |
| Reassignment and Context Menu | 3 | 1 | 0 | 0 | 0 | 0 | **4** |
| Scope Picker | 3 | 1 | 0 | 0 | 0 | 0 | **4** |
| Shift Block Anatomy | 3 | 0 | 0 | 0 | 0 | 0 | **3** |
| Shift Detail Modal | 4 | 4 | 0 | 0 | 0 | 0 | **8** |
| Shift Start Times and Unassigned Shifts | 6 | 1 | 0 | 0 | 0 | 0 | **7** |
| Sidebar - Line Drill-Down | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| Sidebar - Mini Calendar | 4 | 0 | 0 | 0 | 0 | 0 | **4** |
| Sidebar - Work Order Filters | 6 | 0 | 0 | 0 | 0 | 0 | **6** |
| Sidebar - Work Order List and Search | 4 | 1 | 0 | 0 | 0 | 0 | **5** |
| Working Hours Settings | 5 | 0 | 0 | 0 | 0 | 0 | **5** |
| **TOTAL** | **120** | **28** | **3** | **3** | **2** | **12** | **168** |

**Every row's six outcome columns sum to its Total, and the six totals sum to 168.** Nothing is
double-counted and nothing is left out.

## The 28 on hold, named — with the one thing each is waiting for

| Case | What it is waiting for |
|---|---|
| SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-SPREAD-06 = [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | waiting on the product owner's answer, and the question has not been sent yet |
| SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-DAY-04 = [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-MODAL-06 = [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-EVT-05 = [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | not re-checked against the current build - it needs a drag that could not be completed |
| SCH-VIEW-03 = [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | needs a second sign-in as a user with no staff record of their own |
| SCH-PERM-01 = [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | needs a second sign-in as a view-only user |
| SCH-PERM-02 = [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | needs a second sign-in as a view-only user |
| SCH-PERM-03 = [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | needs a second sign-in as a user without the Schedule permission |
| SCH-PERM-04 = [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | needs a second sign-in as an edit-without-delete user |
| SCH-PERM-05 = [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | needs a second sign-in as an edit-without-delete user |
| SCH-PERM-06 = [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | needs a second sign-in as a delete-capable user |
| SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | needs a second sign-in as a user who cannot see work orders |
| SCH-PERM-09 = [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | needs a second sign-in as a view-only technician |
| SCH-PERM-11 = [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | needs a second sign-in as each of the two staff members |
| SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | waiting on the product owner's answer, and the shop-closure setting does not exist in the build |
| SCH-PERM-12 = [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | needs a second sign-in as a user who cannot see work orders |
| SCH-REG-01 = [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed |
| SCH-REG-02 = [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | the Dashboard section this test needs does not exist in the build |
| SCH-REG-03 = [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | work order creation offers no appointment in the build |
| SCH-REG-05 = [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | the Priority field this test needs does not exist in the build |
| SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | needs three separate sign-ins, one per permission level |
| SCH-API-03 = [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | needs a second sign-in as a user who cannot see work orders |
| SCH-PERM-13 = [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | needs a second sign-in as a holder of each permission level |
| SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | waiting on the product owner's answer, and the question has not been sent yet |

**Grouped, that is:** **13** waiting on a second sign-in as a different user (the whole Permissions area,
plus two API cases and one Filter-and-Display case) · **7** that need a drag our tooling could not
complete, so they were not re-checked against the current build · **3** waiting on a product owner answer
that has never been sent · **3** whose feature is simply not in the build (no Dashboard schedule section,
no appointment on work order creation, no Priority field) · **1** that needs shifts noted before a release
that is already deployed · **1** whose Adjust-side item needs a user with no staff record of their own.

## The 21 that are ready and expected to fail, named

* SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)
* SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939)
* SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)
* SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)
* SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)
* SCH-SER-01 = [C29987](https://shopview.testrail.io/index.php?/cases/view/29987)
* SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)
* SCH-MODAL-02 = [C30009](https://shopview.testrail.io/index.php?/cases/view/30009)
* SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)
* SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)
* SCH-TIP-02 = [C30035](https://shopview.testrail.io/index.php?/cases/view/30035)
* SCH-TIP-03 = [C30036](https://shopview.testrail.io/index.php?/cases/view/30036)
* SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)
* SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)
* SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046)
* SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)
* SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)
* SCH-EDGE-03 = [C30087](https://shopview.testrail.io/index.php?/cases/view/30087)
* SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)
* SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)
* SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)

Each of these names its ticket in the marker and carries the three-outcome block in the case body, so an
automation engineer can wire it up today and a manual tester knows the failure is already reported.

## Honest limits — read these as part of the number

* **The branch has NOT been declared final, so every verdict here is PROVISIONAL** (Standing Rule 49).
  The re-check queue is OPEN.
* **The 168 verdicts do not all come from the same build.** **90** were seen on **`v3.5-7ec992f`** and
  **78** on **`v3.5-d122eef`**, which no longer exists. Every case says on itself which build it was
  checked against, so this is visible per case rather than hidden in an average.
* **12 cases have never been observed at all** and say so — they need a sign-in we do not have.
* **7 deviations were not re-checked this session.** They were seen on the retired build and their
  faults may well be fixed by now; we did not look, and we do not guess.
* **2 cases are only partly observed** and say which of their items are not claimed.
* This pass **re-drove 18 of the 25 stale deviations and drove all 27 previously unobserved cases**. It
  was not a fresh live run of all 168 and does not claim to be.

## What changed since 5 August

* **Seven cases stopped being failures.** SV-8857, SV-8849 and SV-8850 are fixed, the create-event toast
  and Undo now exist, event cards are now structurally distinct, and the tooltip now caps line names at
  three. Every one of those tickets is still Open or Ready to Fix in Jira — which is exactly why ticket
  status was never used as a verdict.
* **One case we had already passed turned out to be a regression.** The click alternative to dragging has
  been removed from the build; that is now SV-8957.
* **One feature shipped.** The long-series and 120-shift guards on the scheduling endpoint now exist and
  behave correctly.
* **One ticket of ours was withdrawn as invalid** — SV-8923, closed OBSOLETE, because it had been raised
  against a shop with no business hours configured, which the source case's own precondition required.

## OUTSTANDING — what I need from you

1. **A second sign-in, as a user who is not an administrator.** This is the single biggest gap: it is the
   only thing blocking **13 cases**, the whole Permissions area among them. Impersonation was deliberately
   not used because a sibling worker shares this sign-in.
2. **The branch declared final**, or told plainly that it is not. Until then all 168 verdicts stay
   provisional and the re-check queue stays open.
3. **Branko's answer on shop closures.** The specification states it two ways, the question has never been
   sent, and it blocks 3 cases. Worth knowing: the shop-closure setting does not exist anywhere in the
   product yet, so his answer alone will not make those cases runnable.
4. **A decision on the 7 deviations we could not re-drive.** They need either a working drag path or your
   agreement that they stay on the older build marker until someone can drive them by hand.
5. **Whether to reopen anything.** SV-8849, SV-8850 and SV-8857 no longer reproduce and are still open;
   SV-8895 and SV-8894, which another QA filed, do not reproduce as written on this build either. We did
   not touch anyone else's ticket.
