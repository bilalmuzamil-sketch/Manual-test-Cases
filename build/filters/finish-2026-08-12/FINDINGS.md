# Filters — findings, 2026-08-12

Build `v3.6-3e9dd6d`, unmoved. Location **Staging Heavy Duty - 9919**. 0 bridge errors.

## 1 · One real build deviation, unticketed — [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)

Spec v19 `S8-R4`/`S8-R5` require the no-results state to offer a way to clear the filters **and, when a
search is active, a separate way to clear the search**. The build shows
**`No work orders match your filters`** — filters only, even when only a search is active — and offers
**`Clear Filters`** alone.

Proven as an absence properly: the scanner was first run in a state where the search-clear control
**is** present and saw it. **No ticket exists and none could be created (hold active).** Full text and
both quotations in `DIVERGENCES.md` §2.

## 2 · One correction that saves a test — [C43590](https://shopview.testrail.io/index.php?/cases/view/43590)

Its precondition pointed at Parts → Part Sales, which now has **no filter bar at all**. **Reports →
Technician Efficiency** has exactly one filter button and no collapse control. Corrected, and the
escape hatch widened. Without it a runnable case would have been marked BLOCKED tomorrow.

## 3 · A 14-page filter-bar map, which did not exist before

| chips | pages |
|---|---|
| 0 | Part Sales · Purchase Orders · Deliveries · Customers · Vendors · Assets · Sales Tax Collected · IBS Batches · Sales By Customer |
| **1** | **Technician Efficiency** (`range`) |
| 2 | Parts Returns (`core_only`, `vendor`) · Timesheet Activities (`range`, `staffId`) |
| 3 | Parts Inventory (`gridLocation`, `category`, `supply`) |
| 5 | Work Orders (`status`, `company_id`, `tech_assigned_id`, `service_advisor_id`, `vehicleHere`) |

**The collapse control appears exactly where there are 2+ chips and nowhere else** — which is
SV-9041's rule, observed rather than assumed. It is also the answer to several held Parts/Reports
cases once Branko's write-up lands.

## 4 · Confirmations worth recording

- **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889)'s expect-fail symptom is
  unchanged** on the shipping build: no page search on a phone, only the global one in the top bar.
  The marker is still correctly backed by SV-8912.
- **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) passes cleanly** — from an
  unfiltered page, typing in the top-nav search left the list at 33 rows and added no `search=` to the
  URL.
- **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895)'s per-user isolation is real** —
  the two identities return **different** `work-orders-list` preferences (admin carries a `totalPrice`
  column, the technician does not).
- **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) behaves as documented** —
  Imported disables all four other chips at `opacity 0.7`.

## 5 · The second sign-in works, and it unblocks the access half of two held cases

The Technician identity reaches Work Orders with all five chips, fewer nav items and no financial
columns. **C29615 and C38895 are unblocked at the access level** — neither was driven to a verdict.

## 6 · Reported, not acted on

- **5 held cases already carry a `Passed` result** — C29559, C29609, C29610, C29612, C29615 — graded by
  user 7 with empty comments. **C29615's whole assertion is that one person's saved filters do not
  reach another**, which cannot be seen from a single sign-in. Another author's result on our case:
  the QA lead's call.
- **Run 352 was re-scoped and fully assigned to user 7 under our shared account** during the session.
- **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) is held on a QA-lead ruling**
  while its behaviour is documented at `S10-R4` — it may simply be releasable.

## 7 · Eleven false absences, caught

Listed in `RUNNABILITY.md`. Every one was our own harness, not the product. The two that would have
been most embarrassing: *"ticking Imported does not disable the other chips"* (the menu never opened)
and *"the Search button does not change on hover"* (Quasar paints hover on a child element the check
never read).

## OUTSTANDING — what I need from you

1. **Lift the hold, or tell me to hold, on a C38897 defect ticket.** It is the only unticketed real
   deviation found.
2. **A ruling on the 5 held cases already marked Passed by user 7**, C29615 above all.
3. **Branko's Parts and Reports write-up** — 8 held cases, outstanding since 27 July.
4. **A ruling on [C38880](https://shopview.testrail.io/index.php?/cases/view/38880)**, held on your own
   decision while the behaviour is documented.
5. **Note that C29581 and C29588 need a staff record deactivated** — barred on this branch, but
   ordinary work for a tester.
