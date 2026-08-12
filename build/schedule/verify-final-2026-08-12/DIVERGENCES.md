# Schedule — where a source-learned precondition or step did NOT hold on the build

**For the QA lead, 2026-08-12. Build `v3.5-65d6500`.**

This file exists because a step or precondition learned from the sources is only worth anything if a
manual tester can actually carry it out tomorrow. Each row below is a case where the sources ask for
something the build or the test estate does not currently offer.

**Nothing here was silently rewritten to match the build.** Where the route the source describes does
not exist, the case keeps what the source says and is marked so a tester is not stranded.

**And nothing here changes an expected behaviour.** The expectations still come only from the
specification, the epic and your recorded answers.

---

## A · SUBSTANTIVE — the thing the source asks for cannot be set up at all

**All six are the same shape: the case needs a user at a particular permission level, and that user
does not exist on this estate.** The Schedule branch has exactly **two** sign-ins — the administrator,
and the Technician you supplied today (Schedule: View, no Edit, no Delete).

**This is a TEST-DATA gap, not a defect in the product.** I am not claiming the build is wrong; I am
telling you these cases cannot be run as written, and what would make them runnable.

**I did not create the missing users, because you have told us to create nothing until your next
order.** Each one is a role assignment away.

| Case | What the source asks for | What the estate has | Now marked |
|---|---|---|---|
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | point 4 needs a user with **no technician or staff record of their own** | both available users have a staff record | `HOLD` — **points 1 to 3 observed and passing** |
| [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | a user with **Schedule: View switched OFF** | both users have Schedule: View | `HOLD` |
| [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) · [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | a user with **Schedule: Edit but NOT Delete** | no such user | `HOLD` |
| [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | a user with **Schedule: Delete** who is not an administrator | no such user | `HOLD` |
| [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) · [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) · [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | a user with Schedule: View but **WITHOUT Work Orders: View** | the Technician has Work Orders: View | `HOLD` — **C38874 point 1 observed and passing** |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | **three** users: none · View only · View + Edit not Delete | two: administrator and View-only | `HOLD` — **point 2 observed and passing** |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | a holder of **each** Schedule permission level | two levels of the four | `HOLD` |
| [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | two staff members, one with the **`Time Clock` setting ON** and one **OFF** | setting it means editing a staff record on the shared branch on release eve | `HOLD` |

**What would clear all of them: three role assignments** — one user with Schedule permission off, one
with Edit but not Delete, one without Work Orders: View. **That is the single highest-value thing
anyone could give this suite**, and it is worth saying plainly that it would unblock **ten** cases.

## B · SUBSTANTIVE — the control the source describes is not in the build

Both were found and recorded earlier in the week and are already marked; they are repeated here
because they are the clearest examples of what this file is for.

| Case | Source says | Build offers | Now marked |
|---|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | a control to collapse the left work-order panel | **no such control anywhere.** The only panel-like control is `Hide the calendar`, which folds the month calendar *inside* the panel — a different thing | `HOLD - the panel button does not exist in this build` |
| [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | a click alternative to dragging (§7 and §11) | **removed between builds.** It was proven present on 5 August and is gone now | `READY - EXPECT FAIL`, [SV-8957](https://shopview.atlassian.net/browse/SV-8957) |

## C · COSMETIC — corrected so the tester can run the case

These are the "same thing by a slightly different name" class. Corrected, not escalated.

| Case | Was | Build | When |
|---|---|---|---|
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) · [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | `Set custom hours for this technician` | **`Set working hours for this technician`** | 12 Aug |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | `Add hours` | **`Add Hours`** | 12 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) and 5 more | `View Options` | **`View options`** | 11 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) and 5 more | `Filter & Display` / `Filter and Display` | **`Filter & display`** | 11 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | `VIN` | **`VIN Number`** | 11 Aug |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | `Capacity Bars` | **`Capacity Planning`** | 11 Aug |

**One of those was not cosmetic at all, and it is the reason this file matters.**
[C38926](https://shopview.testrail.io/index.php?/cases/view/38926) told the tester to open the roles
list, use the three-dot menu on a role, and choose `Reset To Template`. **There is no such item in
that menu** — both System roles offer only `View Permissions`. The control is `Reset to template`, on
the role's own edit screen. A tester following the old step would have opened the menu, found
nothing, and been stuck — on a case whose entire purpose is to reset roles before permission testing.
**Corrected 12 August.**

## D · WHAT I VERIFIED AND FOUND RUNNABLE AS WRITTEN

Reported because "no change needed" is only trustworthy if it was actually checked.

**Every precondition and every step of [C30074](https://shopview.testrail.io/index.php?/cases/view/30074),
[C30075](https://shopview.testrail.io/index.php?/cases/view/30075),
[C30082](https://shopview.testrail.io/index.php?/cases/view/30082) and
[C30044](https://shopview.testrail.io/index.php?/cases/view/30044) was carried out on the build, in
the order written, as the Technician** — the sign-in, the shifts and events already on the grid, all
three views, the mini calendar, the toolbar search, the sidebar filter, the hover tooltip, the detail
modal, and the `My Shifts` toggle. **Nothing needed correcting.**

## F · FOUND TODAY — three more, added after the first version of this file

| Case | Class | What the case said | What the build ships | Done |
|---|---|---|---|---|
| [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | **cosmetic, but it would have stranded a tester** | step 1: use the **`this and everything after`** scope | the option reads **`This and all later shifts`** | **step corrected** |
| [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | **needs your ruling** | its EXPECTED result names the options **`this and after`**, **`this only`**, **`whole series`** | **`This and all later shifts`**, **`This shift only`**, **`Entire series (8 shifts)`** | **NOT edited — raised** |
| [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | **deviation** | the tooltip shows the VIN **whenever the unit has one, regardless of the `VIN Number` toggle** — your 31 July decision | VIN appears **only when the toggle is ON**. Off: `G30`. On: `G30 · VIN 12-06696` | expectation kept; deviation recorded |

**Why C30061 was left alone and C30059 was corrected.** C30059's shorthand is in a **step** — a
tester follows it, hunts for wording that does not exist, and is stuck. C30061's shorthand is in the
**expected result**, and an expected result is not ours to edit. The wording is recognisably the same
three options, so nobody is stranded; but the case reads oddly against the screen and **you may want
it aligned**. One word from you and it is a two-minute change.

**And one thing got BETTER, which is worth as much as a defect.** C30034 carried a note saying the
tooltip listed **all five** line names with no overflow row. **That is no longer true** — a six-line
shift showed exactly three names and a **`+3 more lines`** row. The stale note is gone. It was found
because the case was re-driven, not because a ticket changed status.

## E · WHAT I HAVE NOT CHECKED — the number stated strictly

**This pass verified every precondition and every step, in the order written, on 6 cases**:
C30074, C30075, C30082, C30044 (as the Technician), and C30061, C30034 (as the administrator).

**Five more were partly verified**, and I will not round them up:
· **C38872, C38874** — the legs this Technician can reach were carried out; the rest cannot be set up
· **C29946** — the `Clear all` control was located and its label read, but the click was not driven
· **C30058, C30059** — their steps require actually **deleting** a shift from a live series. The scope
dialog was opened and read, then cancelled. **The deletion was not performed**, so their steps are
**not** fully verified, and I am not claiming they are.

**Counting every committed pass on this same build**, the cases whose steps have actually been
carried out are **28 of 176** — 8 from the drag re-try, 14 from the dialog pass, and these 6.

**So the honest figure for "a tester could pick this up tomorrow and run it start to finish" is 28 of
176 proven.** The other 148 have had their **labels** compared against a harvest of this build, which
is worth something but is not the same claim. I would rather hand you that number than a comfortable
one.
