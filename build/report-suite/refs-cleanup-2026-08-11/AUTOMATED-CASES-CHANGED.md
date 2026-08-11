# Automated cases changed — for Vlad (Standing Rule 65)

**Plain summary, and it is the whole story: this pass changed one field on these cases — the
*References* field, which records which version of the written specification the case comes from.
Not one step, not one expected result, not one automation marker, not one title changed on any case
in the suite. Nothing an automated check reads has moved, so nothing should need adjusting.**

**10 of the 40 cases TestRail flags as Automated were touched.** The flag reported is
`custom_atmstatus = 3`, **captured at write time** — Rule 65 requires that, because the flag can
move and reading it afterwards can give a different answer from the truth at the moment of the write.

---

## Does this change what an automated check should conclude?

**No — for every case below, and the reasoning is stated plainly so it can be overruled rather than
taken on trust.** `refs` is a traceability field: it is not shown to the tester as an instruction,
it is not part of any assertion, and no automated check reads it. Two kinds of change were made:

- **A version pin was added** where a citation named a specification without saying which version.
  That records which document the expectation came from. It does not change the expectation.
- **A pin's date was corrected by one day** on the Technician Utilization cases. Same version, same
  document, same requirement — the date beside it now matches the day Confluence actually published
  it.

**Neither can change whether a test passes.**

---

## The 10 cases

| Case | Section | Title | Change | Flag set by |
|---|---|---|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | WIP — Tabs | Four tabs in a fixed order with the partially-completed tab selected | pin form normalised | user 1 |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | WIP — Permissions | Without reports access Work In Progress is absent from the navigation | version pin added | user 1 |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | TU — Access & Display | Without reports access Technician Utilization is hidden | pin date, one day | user 1 |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | TU — Access & Display | Standard no-data message when no time in scope or all technicians deselected | pin date, one day | user 1 |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | TU — Hours & Utilization | Headers in fixed order; Total, WO and Internal Hours shown | pin date, one day | user 1 |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | TU — Est. Lost Labor | Est. Lost Labor values internal hours at each location's default rate | pin date, one day | user 1 |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | TU — Sorting | All six columns sort on screen: ascending first, toggling after | pin date, one day | user 1 |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | TU — Technician Filter | Deselecting a technician hides the row and recalculates the totals | pin date, one day | user 1 |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | TU — Deep Links | The Total Hours link opens Timesheet Activities in the same tab | pin date, one day | user 1 |
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | TU — API | The per-day breakdown is fetched only when a technician row is expanded | pin date, one day | user 1 |

**8 of the 10 are the same one-day date correction on Technician Utilization**, so for most of this
list the change is a single character.

---

## Who set the Automated flag — checked, not assumed

Rule 65 is explicit that this must be established rather than inferred, because on the Schedule
project **nobody** ever set the flag — our own tooling hardcoded it — and reporting those to the
automation engineer as his own work would have padded the list and cost it credibility on the first
reading.

**All 40 Automated cases in the suite were checked** via `get_history_for_case`, not just the 10
touched:

- **40 of 40** carry a recorded `custom_atmstatus` change, so a person set each one deliberately.
- **0** have no recorded change — none was born Automated by our tooling.
- **Every one was flipped from *Not Automated* to *Automated* by user id 1 — Vladimir Tomovic
  himself.**

**So this list is genuinely his own work, and nothing in it is padding.** Evidence:
`logs/atm-history.json`.

---

## The honest boundary of this report

**This pass added no automation marker, removed none, and changed none.** A live census after the
writes confirms **480 of 480 cases carry exactly one marker**, unchanged from before.

**Nothing in this pass is a reason to re-run anything.** If a Technician Utilization check is
failing today, this pass is not why — the only thing that moved on those cases is a date inside a
traceability field.
