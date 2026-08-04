# Schedule — outside-in gap hunt (Standing Rule 45)

All five checks run, with the result of each stated. "Not applicable" is a permitted answer;
silence is not.

## (a) Foreign-coverage diff, in BOTH directions

**Their cases → ours (overlap):** **there are no foreign cases.** All 165 cases under TestRail group
4254 return `created_by: 3` (us). Re-checked after the push: still 165 / 165. Nothing to overlap and
nothing to touch.

**Their assertions → ours (the reverse direction, the one that matters):** the reverse diff for this
project is not a case diff — it is a **ticket diff**, because the outsider working from this build was
not writing cases, he was raising defects. **Twelve tickets, SV-8826 … SV-8841, all raised on
2026-08-04 by Mudassir Qamar**, none of which we knew existed. Every one was diffed against the suite:

| their assertion | our counterpart | label |
|---|---|---|
| SV-8826 week starts Sunday | SCH-NAV-03 = C29927 asserts Mon→Sun | **COVERED-BY** — our case fails the build, correctly |
| SV-8827 View Options defaults | SCH-VIEW-05 = C30046 enumerates all six defaults | **COVERED-BY** |
| SV-8829 estimated hours not editable / no labor figures | SCH-MODAL-05 = C30012 (edit) and SCH-MODAL-04 = C30011 (money) | **COVERED-BY** — and the money half **CONTRADICTS-OURS**, resolved by PO ruling |
| SV-8830 weekend shift not flagged | SCH-CONF-02 = C30024 | **COVERED-BY** — and does not reproduce as written |
| SV-8831 Jose Young has no staff record | **nothing** | **CANDIDATE GAP** — see below |
| SV-8833 time picker allows any minute | SCH-MODAL-02 = C30009 | **COVERED-BY** |
| SV-8834 time logged shows complete when nothing clocked | SCH-MODAL-03 = C30010 | **COVERED-BY** |
| SV-8835 tooltip shows VIN with the switch off | SCH-TIP-01 = C30034 | **CONTRADICTS-OURS**, resolved by PO ruling |
| SV-8837 day view does not auto-scroll | SCH-DAY-01 = C30001 | **COVERED-BY** |
| SV-8839 capacity counts non-working days | SCH-CAP-01 = C30030 / SCH-CAP-04 = C30033 | **COVERED-BY** |
| SV-8840 no drag feedback | SCH-DND-06 = C29960 | **COVERED-BY** |
| SV-8841 full work-order number finds nothing | SCH-WOL-04 = C29939 | **COVERED-BY** |

**Eleven of twelve were already covered.** That is the honest headline, and it is a good one.

**THE ONE CANDIDATE GAP: SV-8831.** No case in the suite asserts that **every technician row on the
grid corresponds to a real, active staff record**. SCH-PERM-10 = C30083 asserts the *rule* (rows come
from the department assignment, not the role) but nothing asserts the *integrity* — that a name on
the board can be found in Staff. Mudassir found a row (Jose Young) that exists on the Schedule and as
a lead tech on a work order but returns nothing from a Staff search, and **we had no case that would
ever have caught it.** A corrective case is **proposed, not authored** — authoring needs the QA lead's
go-ahead (Rule 6). Proposed wording is in `DELIBERATE-DECISIONS.md`.

## (b) The automation-engineer lens — genuinely available for the first time

*"If I were automating this from the running build, what would I assert?"* — and this pass could
actually answer it, because there was a build. Three things an automation engineer would assert that
we would not have thought to:

1. **The grid is FullCalendar and it carries 166 `data-test-id` hooks.** An automation engineer would
   hang everything off those, not off text. We now record the full map (`snapshots/testids-union.json`)
   so no one re-derives it.
2. **Times round-trip through UTC.** Anyone asserting a rendered time against a seeded time would fail
   on the first test — which is exactly how SV-8848 was found. **This lens is what produced our
   single most valuable finding.**
3. **Drag-and-drop needs real pointer emulation.** There is no click-to-arm alternative
   (SCH-DND-08 = C29962, NOT BUILT), so the 8 drag cases cannot be driven by simple clicks. That is a
   material fact for whoever scopes the automation, and it is now on the case.

**Honest limit:** the branch is not final, so all of it is provisional (Rule 49).

## (c) The hostile-reviewer lens

Run before delivery, not after the challenge. Its output is `DELIBERATE-DECISIONS.md` — 3 HIGH-risk
entries, and the HIGH ratings are honest: if the PO-ruling cases are raised in public we have a
concession to make, not merely an explanation.

## (d) Every external signal treated as a coverage input, not a reply

Three signals arrived from outside our own work today and **all three were diffed against the suite
rather than answered**:

1. **The twelve tickets** → one real coverage gap (SV-8831) and two PO-ruling clashes. Table above.
2. **Run 357's results** → checked, not assumed: 429 result records, all `created_by: 3` (ours), all
   Untested, **zero tester comments and zero failures**. Unlike Filters, no reviewer has executed
   this run, so there was no reviewer signal in it. Stated rather than left silent.
3. **The QA branch itself** (source 6) → ten defects the document could never have shown us.

## (e) No "covered" verdict without both texts quoted

`COVERAGE-REDERIVATION.md` prints, for **every one of the 194 requirements**, the requirement text
verbatim beside the covering case's own expected-result text. A row that named only case ids would be
non-compliant and unfalsifiable. **179 of 194 requirements are covered; the 15 that are not are each
named with the reason they are not testable** (rationale prose, the persona table, the business
success metrics, and the explicitly out-of-scope Future considerations section). Remainder: **zero**.
