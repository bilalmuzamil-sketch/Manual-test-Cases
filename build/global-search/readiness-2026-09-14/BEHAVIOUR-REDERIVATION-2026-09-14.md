# THE LAST GAP CLOSED — the behaviour list re-derived from scratch

**Date:** 2026-09-14 · **Baseline:** `ShopView/shopview @ 55767168`

## WHY THIS WAS THE ONLY GAP LEFT

Two halves make up "everything V1 could do":

- **The searchable fields** — what you can type to find a record. Re-derived **independently** from the
  V1 database queries earlier today: 35 of 35 matched. Solid.
- **The behaviours** — how search behaved: limits, ordering, keyboard, permissions, empty states. These
  came from an invariant register I built earlier and then **trusted**. Never re-derived.

So a V1 behaviour could still have been hiding there. **This pass read the V1 front-end source line by
line and rebuilt the list from nothing**, then compared it to the register.

## WHAT WAS READ

| File | What it decides |
|---|---|
| `useGlobalSearch.ts` (324 lines, read in full) | Matching, limits, grouping, history, permissions, refresh |
| `GlobalSearch.vue` (344 lines, read in full) | Everything on screen: rows, icons, headings, shortcut, loading, no-results, mobile |

## THE RESULT — the register was sound, with two real omissions

**Everything else matched.** Every behaviour in the code traced to an invariant that already had a case,
including several I half-expected to be wrong: the two-character minimum, the two matching passes, the
three-per-type cap, de-duplication, the contact re-map, group ordering, history capping and clearing,
the permission pre-filter, the location refresh, the no-workplace guard, first-result highlighting, and
group headings being unselectable.

**Two behaviours were genuinely missing, and both now have cases:**

| New case | The V1 behaviour | Why it matters |
|---|---|---|
| [C55682](https://shopview.testrail.io/index.php?/cases/view/55682) | **Every result row carries an icon showing what kind of record it is** — a building for a customer, a truck for an asset, a shopfront for a vendor, tools for work orders and parts | Without it you cannot tell the kinds apart while scanning a mixed list |
| [C55683](https://shopview.testrail.io/index.php?/cases/view/55683) | **The keyboard shortcut is shown on the search box**, and shows the right one for the machine — the Command symbol on a Mac, Ctrl+K on Windows, hidden on narrow screens | It is how people discover the shortcut. Lose the hint and the shortcut still works, but nobody learns it |

## TWO THINGS FOUND AND DELIBERATELY NOT CASED — with the reason, so you can overrule me

| V1 behaviour | Why no case |
|---|---|
| **Long names are cut off at 30 characters** in a result row | That is a **limit**, not a capability. If V2 shows more of the name, that is better, not worse. Nothing a user could do in V1 becomes impossible |
| **A contact match is slotted in beside its own company's group** rather than appended at the end | An ordering nicety inside a group. The record is still found and still under the right heading. The grouping cases already cover what matters |

## ONE THING THE CODE GOT WRONG, NOT ME

A comment in `useGlobalSearch.ts` says the refresh-after-create is called by *"the 7 create/receive
callers."* **There are five**, and the register said five. Counted directly: the receive-order dialog,
the customer page, the part-sales page, the work-orders page and the customers list. **The comment is
stale; the register was right.**

## WHERE THE SUITE NOW STANDS

| | |
|---|---|
| V1 capabilities enforced | **71** |
| Cases | **62** |
| Tests in run 415 | **161** |
| Capabilities with no case · cases in no run · cases serving nothing | **0 · 0 · 0** |
| Cases tested against V1 rather than the V2 specification | **62 of 62** |

## AND THE DATA FOR THE NEW CASES — checked, not assumed

| Case | Needs | State |
|---|---|---|
| C55682 icons · C55680 arrow keys | One search term returning several kinds at once | ✅ `ZZAUTOTEST` returns **five groups** — work orders (4), customers, assets, parts, vendors. Confirmed live |
| C55683 shortcut hint | Nothing — just a signed-in user | ✅ nothing to seed |
| C55679 recents on a no-match search | Two recently-opened records | ⚠️ **Self-seeding** — recents are personal to whoever runs the test, so the tester must open two records first. Written into the case, and recorded in the seeding manifest |

The seeding manifest now lists, for every case, either the record that serves it, or an explicit note
that it needs no data or seeds itself. **No case is left with its data unaccounted for.**

## OUTSTANDING — what I need from you

Nothing on coverage. **Both halves of "everything V1 could do" have now been independently re-derived
from the V1 source**, and the two gaps that surfaced are closed. The only open item in the whole suite
is the part sale, which is blocked by [SV-10031](https://shopview.atlassian.net/browse/SV-10031).
