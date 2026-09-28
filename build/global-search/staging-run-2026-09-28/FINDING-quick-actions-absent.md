# ~~Quick actions on hover are absent from the search results~~ — CLOSED, NOT A DEFECT

> **CLOSED 28 September 2026, the same day it was written.** The feature was **dropped**, so the
> buttons are absent because nobody built them, not because they broke.
>
> **SV-9173 "FE — Contextual quick actions on result rows" is OBSOLETE**, resolution *Done*, closed
> 17 September 2026 — read live from Jira on 28 September, before anything was put to the QA lead.
> The eight checks that cover it (C44866-C44873) are correctly OUTSIDE run 415, and the requirement
> quoted below comes from a specification section the product no longer implements.
>
> **Nothing is to be raised.** What the QA lead may still want is a decision on whether those eight
> checks are retired or reworded — the same question as the other out-of-date checks in
> `REPORT-FULL-RERUN-2026-09-28.md` §5 item 1.
>
> **The measurements below stand** — the buttons really are absent, proved through the screen with a
> real pointer and a positive control. Only the CONCLUSION changed, from "a fault worth reporting"
> to "a feature that was cancelled". That distinction is why this file is corrected in place rather
> than deleted.

---

**Environment** app.staging.shopview.com · build **v26.39.1-02c6b6c** · workplace Staging Heavy Duty - 9919
· signed in as administrator (59 permissions). The QA branch sv9160 was merged here and deleted.

## What the source requires

Simple/Global Search PRD §5.4 *Quick actions on hover*, quoted verbatim from the text read on
22 September 2026 (`source-verify-2026-09-22/spec-576978945-2026-09-22.txt`, line 103):

> "On hover (desktop only — pointer present), a right-aligned button appears in the row"

with, per entity: Work Order → *Add new line* · Asset → *New work order* plus history and invoice
icons · Customer → *New work order*, *New contact* · Vendor → *Add contact* · Part → *Add to work
order* or *Add part*. Vendor Invoice → no quick action.

## What the build does

**No quick action appears on any row, for any entity.** Measured on the five entity tabs
(Work orders, Customers, Assets, Parts, Vendors), on genuine result rows, with a real pointer:

| Entity | Row used | Actions at rest | While hovered | Keyboard-selected |
|---|---|---|---|---|
| Work orders | S2-34271 4 Star Truck Repair | none | none | none |
| Customers | Truckmaster Truck & Trailer Repair - Erie | none | none | none |
| Assets | TRUCK · 2018 Freightliner Cascadia | none | none | none |
| Parts | TRUCK BOX TARP CRANK | none | none | none |
| Vendors | Agolli Truck Center | none | none | none |

The expected labels do not exist anywhere in the page while a row is hovered — *Add new line*,
*New work order*, *New contact*, *Add contact* and *View part history* all return nothing from a
whole-document text search. The only button classes inside the modal are `search-modal__clear`
(the clear control) and `search-group__show-all`. There is no quick-action element of any kind.

## Why this is the product and not the measurement (Rule 104)

1. **Positive control.** Hovering an UNSELECTED row does change it: class goes
   `search-row` → `search-row search-row--selected` and the background goes
   `rgba(0,0,0,0)` → `rgb(248,250,252)`. Hover registers in this modal.
2. **Through the screen.** A real pointer move (`mouse.move` with steps), not a dispatched event.
   A synthetic `mouseover` was tried first and found nothing anywhere — it cannot trigger a CSS
   `:hover` state, and that first attempt is void; this one is not.
3. **The rows are results, not recents.** The modal's "recent" rows carry
   `data-test-id="search_result_row_recent_…"` and have no actions by design. Every row used here is
   `search_result_row_<entity>_<n>`, after typing a query.
4. **The pointer gate is satisfied.** The requirement says "desktop only — pointer present". The
   browser reports `hover: hover` true, `pointer: fine` true, `any-hover: hover` true,
   `maxTouchPoints` 0, width 1680. The app has no pointer-based reason to withhold them.
5. **Both triggers tried** — mouse hover and keyboard selection (arrow keys), separately.
6. **Repeated** across five entities and several runs on a settled page.
7. **The tab labels were verified** — after a search they read "Work orders (20)" etc., and an
   earlier exact-match selector silently failed, which is why the first per-entity pass was void.

## What it covers

Eight checks assert this behaviour: **C44866 · C44867 · C44868 · C44869 · C44870 · C44871 · C44872
· C44873**, section 6774 "Quick Actions on Hover (v1)". On the evidence above every one of them
fails on staging.

## 🛑 They can no longer be recorded — the tests vanished from the run

Run 415 held **202 tests** when this session began and holds **194** now; the run's `updated_on` is
**2026-09-28 16:43 UTC**. All eight hover tests are gone from it, while the cases themselves still
exist in section 6774. **This session made no write of any kind to run 415** — its only TestRail
writes today were results in run 416, the C44591 rewrite, and seven Simple Flow case deletions, none
of which touch run 415 or section 6774. Another session or a person removed them.

Rule 34 is the likely mechanism: passing a partial `case_ids` list to `update_run` DELETES the tests
it omits **and their results**, unrecoverably.

**This needs the QA lead's decision and was not acted on unattended:** re-adding cases to a run is a
run write, and doing it wrong destroys results. The finding above stands on its own evidence whatever
is decided about the run.
