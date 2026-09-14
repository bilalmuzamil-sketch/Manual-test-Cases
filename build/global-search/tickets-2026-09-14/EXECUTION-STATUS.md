# Global Search V2 — run 415 regression execution, status

**Branch:** sv9160 · **Run:** 415 · **Suite section:** 6769 · **Scope:** the **62** cases in run 415
carrying the regression flag (reconciled live: run 415 holds 162 tests, 62 are the regression set,
and the execution plan matches it exactly in both directions).

**Nothing has been written to TestRail.** The QA lead's instruction was *"before writing anything on
testrail, RUN all the test cases and unblock yourself everywhere."*

---

## Where the work stands

| | Cases | State |
|---|---|---|
| Query-driven | 41 | Executed with the corrected instrument; judging in progress |
| Not query-driven | 9 | Executor written (`RUN_special.mjs`), not yet run |
| Role-gated | 12 | Route identified, not yet run |
| **Total** | **62** | |

## The instrument was wrong, and that is the main event of this pass

An earlier pass judged from the per-type **counts** in the tab strip. Four separate faults were found
in it, each capable of producing a defect that is not real. All four are fixed and recorded in
playbook **§GS** and learnings **L0082-L0085, L0087**:

1. **The modal remembers its scope tab across close/reopen.** Every case that ran after a scoped one
   read its "All" view through the previous case's filter. `Marlene` read as a single Asset row beside
   a strip counting 16 across 5 categories; two exact-identifier queries read as flat zeros. All clean
   once **All** is selected explicitly.
2. **The API cross-check fetched a relative path**, which resolves against the front-end origin and
   returns the SPA's HTML. The comparison **failed open** and reported agreement without comparing
   anything. It now reads the response the app itself received, off the wire.
3. **Rows were filtered by on-screen geometry**, turning "below the fold in a scrolling list" into
   "missing".
4. **The scoped view was read after a flat 2.5s** while counts settle at ~4-5s — so a section still
   loading reads **empty**, which is precisely the failure the QA lead found by hand and filed four
   Story Defects for. Fixed; **any case observed with an empty section under the flat wait is being
   re-run, not judged.**

Every observation now carries three signals that must agree — the strip's counts, the modal's own
"N results found across M categories" line, and the `/api/search` response the page was rendered from
— plus the **rendered rows**, read from the app's own `search_result_row_<type>_<n>` test ids. A
disagreement triggers a longer settle and a second look, and only survives as a finding if it survives
that.

Every **zero** is checked against the declarative seed manifest, which states what each seeded record
carries on which field. A zero for a value nothing seeded carries is a data gap, not a product finding.

## The twelve role-gated cases are not blocked

Quick-login offers exactly two users (admin, tech), so the route is the playbook's §G recipe, least
invasive first: **impersonate an existing holder** (`POST /api/switch-user`, mutates nothing) →
else **swap the role on the Tech user** and restore it afterwards. Rule 107 authorises both. The QA
lead's standing constraint protects the **admin** staff user and is not touched either way.

## Already-filed tickets — one to re-check, none to touch

The QA lead's instruction stands: *"Do not touch the tickets which you have already filed."* One item
for him: **SV-10016** says the part `ZZT-88-4412` is counted but missing from the Parts section. With
the corrected instrument, on the data as it stands today, that part **does** appear under Parts. The
seed was rebuilt after his recording, so this may be different data rather than a fix. Reported, not
edited.
