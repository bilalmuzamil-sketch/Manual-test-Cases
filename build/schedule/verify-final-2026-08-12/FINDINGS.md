# Schedule — findings, verify-final, 2026-08-12

**Build `v3.5-65d6500`** — `index.html` byte-identical by sha256 at pass start and pass end, and
unchanged since 11 August 09:33 GMT. **Location `Staging Heavy Duty - 9919`.**

---

## THE HEADLINE

**76 of 176 Schedule cases now rest on the build that ships tomorrow, up from 22.**
**28 of 176 have had their preconditions and steps actually walked on it.**

Those are two different numbers on purpose, and the second is the one that answers *"can a tester
pick this up tomorrow and run it?"*

---

## 1 · A REAL DEVIATION, FOUND BY RE-DRIVING A CASE

**[C30034](https://shopview.testrail.io/index.php?/cases/view/30034) — the shift tooltip hides the
VIN unless a display toggle is on.**

| `VIN Number` toggle | Tooltip's second line |
|---|---|
| OFF | `G30` |
| ON | `G30 · VIN 12-06696` |

The documented decision of 31 July asks for the VIN **whenever the unit has one, whichever way the
toggle is set**. **The expectation was not changed** (Rule 57); the disagreement is recorded on the
case and the marker is the no-ticket `HOLD`, because the creation hold means there is no ticket
number to name.

## 2 · AND ONE THING GOT BETTER — worth as much as a defect

**The same case carried a note saying the tooltip listed ALL FIVE line names with no overflow row.
That is no longer true.** A six-line shift showed exactly three names and a `+3 more lines` row —
which is what the specification asks for.

**It was found by re-driving the case, not by a ticket changing status.** That is Standing Rule 61
working exactly as intended: the fix shipped silently, and only an observation could reveal it. The
stale note is gone.

## 3 · A STEP THAT WOULD HAVE STRANDED A TESTER

**[C30059](https://shopview.testrail.io/index.php?/cases/view/30059)** told the tester to delete a
shift *"with the `this and everything after` scope"*. **There is no such option.** The dialog offers
`This shift only`, `This and all later shifts`, `Entire series (8 shifts)`. Corrected.

**Its sibling [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) has the same
shorthand in its EXPECTED RESULT, and was deliberately left alone and raised** — an expectation is
not ours to edit.

## 4 · THE TECHNICIAN SIGN-IN — identity proven four ways before any observation

| Check | Administrator | Technician |
|---|---|---|
| `fe_permissions` | **42** | **6** |
| `view_mode` | `full` | **`tech`** |
| `view-profile` | `admin@shopview.com` | **`bilal.muzamil+schedule@shopview.com`** |
| `GET /api/staff` | **200** | **403 Access denied** |

Corroborated on screen: the navigation shows only **Work Orders · Schedule · Customers**.

**Three cases now pass that could never be run before** — C30074, C30075, C30082. A view-only user
gets all three views, the mini calendar, the search, the sidebar filter, hover tooltips and a
**read-only** detail modal (**0 editable inputs, no reassign, no delete**), while **21 sidebar cards
carry no drag affordance**, **6 blocks carry no resize handle**, and a left-click on a proven-empty
cell opens **no creation menu**.

**And there is no own-only restriction**: the technician sees **30 lanes and 37 technician names** —
the same board the administrator sees, byte-for-byte the same length in the API response. `My Shifts`
narrows it to **1 lane** and restores to 30.

## 5 · THE BACK END ENFORCES THE PERMISSION TIERS — proven by contrast

| Call | Administrator | Technician (View only) |
|---|---|---|
| `GET /api/schedule/work-orders` | 200 | **200** |
| `POST /api/schedule/shifts` | 400 (past the gate, bad body) | **403** |
| `PATCH /api/schedule/shifts/{id}` | 400 | **403** |
| `DELETE /api/schedule/shifts/{id}` | 404 (past the gate, unknown id) | **403** |

**The contrast is the proof**: the administrator reaches validation or not-found, so the gate opened;
the technician is refused before it. Every refusal is a clean `403`, never a server error.

**This is NOT a Rule-24 case.** The interface hides editing **and** the back end refuses it. The
dangerous inverse — the interface exposing something the back end blocks — **did not occur**.

**And no pricing field appears in any Schedule response, for either caller** — 45 distinct keys, all
scheduling and identity, no price, cost, rate or total.

## 6 · THE BIGGEST THING STILL BLOCKING THIS SUITE

**Ten cases are held on a user at a permission level this estate does not have.** Three role
assignments — one with Schedule permission off, one with Edit but not Delete, one without Work
Orders: View — would clear all ten. Detail in `DIVERGENCES.md` §A.

## 7 · TWO FALSE ABSENCES OUR OWN TOOLING PRODUCED, AND HOW THEY WERE CAUGHT

Recorded because a manufactured absence is the most expensive mistake available here, and both
were caught by re-reading rather than by luck.

- **`offsetParent !== null` is ALWAYS false for a `position: fixed` element.** Quasar dialogs are
  fixed, so the check reported a fully open, fully populated modal as *"did not open"*.
- **The series cue is not a descendant of the shift block.** A probe looking for it inside
  `schedule_shift_block` found **zero series** on a board holding **13**.

A third, in the harvest builder itself: the 12 August probes stored `{raw, transform}` records while
the 11 August pass stored plain strings, so the first union took only one shape and reported the five
dialog labels **NOT-FOUND**. Fixed; 12 more cases became eligible.

**The rule that catches all three: before recording a control as absent, prove the state it should
appear in and write that proof into the evidence.**

## 8 · ENVIRONMENT — NOTHING CREATED, NOTHING LEFT BEHIND

The board was read from the API host before and after both probe runs and compared **by id**:
**159 shifts before, 159 after — 0 added, 0 removed, 0 changed**, both times. **0 non-GET API calls**
were made from any probe. The series delete dialog was opened, read and **cancelled**; its confirm
button was never pressed. The `VIN Number` toggle was switched on and switched back.

**`admin@shopview.com` was not edited. `quick-login` and `switch-user` were never called.**
