# PRD diff — Confluence 845185030, page v42 (7 Oct 2026) → v48 (12 Oct 2026)

Compared by script (`PRD-DIFF-2026-10-07-vs-now.json`): our capture `sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md` (= page v42, 2026-10-07 14:33 UTC) against the live body saved as `CONFLUENCE-845185030-2026-10-14.md` (page v48, 2026-10-12 16:43 UTC). Our-copy-vs-live diff equals the union of the six per-version diffs v42→v43 … v47→v48, read one by one.
Whole diff in Confluence: https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=48

## Counts

Requirement codes before 221 · now 225 · **added 5 · removed 1 · reworded 5** · identical 215.

## Version history since our copy (all by Chris Ward, PM)

| Version | When (UTC) | Version message | Compare |
|---|---|---|---|
| v43 | 2026-10-08 22:11 | S1-N1 matches the List's empty state; new S1-N1a/S1-N1b with exact messages | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=43) |
| v44 | 2026-10-09 13:29 | S3-R20a: deactivated only; new S3-R20b: not-enrolled pinned technician gets no column (SQ-11) | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=43&selectedPageVersions=44) |
| v45 | 2026-10-12 13:08 | S1-E3: Assigned to me stays on through a location change (SV-11098) | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=44&selectedPageVersions=45) |
| v46 | 2026-10-12 13:11 | S4-R8 context note: Schedule shifts never keep a line (SV-11128) | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=45&selectedPageVersions=46) |
| v47 | 2026-10-12 13:11 | S4-R28: define a work-order-level shift (SV-11126) | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=46&selectedPageVersions=47) |
| v48 | 2026-10-12 16:43 | Imported is List-only (S1-R13a/b), S4-N9 removed (Sasha 2026-09-24) | [diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48) |

## Added

### S1-N1a — v43, 2026-10-08 22:11 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=43))

**Now:** With filters active, with or without a search, the empty state reads “No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button.

### S1-N1b — v43, 2026-10-08 22:11 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=43))

**Now:** With only a search active, the empty state reads “No work orders match the search "{search}".” and shows no button.

### S1-R13a — v48, 2026-10-12 16:43 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48))

**Now:** Imported work orders open in List only. While "Imported" is selected in the Status filter in List, the Board View and Tech View options are greyed out with the tooltip "Not available while Imported is selected."

### S1-R13b — v48, 2026-10-12 16:43 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48))

**Now:** In Board View and Tech View, "Imported" is greyed out in the Status filter with the tooltip "Imported work orders open in List."

### S3-R20b — v44, 2026-10-09 13:29 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=43&selectedPageVersions=44))

**Now:** A pinned technician who is not enrolled at this location gets no column here. If they still lead work orders at this location, they appear as a normal, unpinned column holding that work.


## Removed

### S4-N9 — v48, 2026-10-12 16:43 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48))

**Was:** The disabled Reassign lead technician action on an Imported work order shows this tooltip: “The lead technician can’t be changed on an imported work order.”


## Reworded

### S1-E3 — v45, 2026-10-12 13:08 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=44&selectedPageVersions=45))

**Was:** Assigned to me resets on location change, as it does today.

**Now:** Assigned to me stays as the user set it when the location changes, as it does today.

### S1-N1 — v43, 2026-10-08 22:11 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=43))

**Was:** When filters return no results, show the existing List empty state and Clear filters action in every display: “No work orders match your filters”.

**Now:** When the active filters or a search return no work orders, Tech View and Board View show the same empty state as the List, with the same messages and action.

### S3-R20a — v44, 2026-10-09 13:29 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=43&selectedPageVersions=44))

**Was:** The empty column of a pinned technician who can no longer be assigned work orders (deactivated, or not enrolled at this location) shows “No work orders” to every user, because nothing can be dropped there (S4-N5).

**Now:** The empty column of a pinned technician who has been deactivated shows “No work orders” to every user, because nothing can be dropped there (S4-N5).

### S4-N2 — v48, 2026-10-12 16:43 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48))

**Was:** Do not allow the lead technician to change in Invoiced, Paid, or Imported status. An Invoiced or Paid work order can still be dragged to reorder it within its current technician (or within Unassigned), but it cannot be moved to another technician, to Unassigned, or out of Unassigned. Declined and Complete work orders can be moved freely, as today.

**Now:** Do not allow the lead technician to change in Invoiced or Paid status. An Invoiced or Paid work order can still be dragged to reorder it within its current technician (or within Unassigned), but it cannot be moved to another technician, to Unassigned, or out of Unassigned. Declined and Complete work orders can be moved freely, as today.

### S4-R28 — v47, 2026-10-12 13:11 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=46&selectedPageVersions=47))

**Was:** The shift-clearing prompt (S4-R11, S4-R26) shows only when the outgoing lead has a work-order-level shift on this work order that has not ended.

**Now:** The shift-clearing prompt (S4-R11, S4-R26) shows only when the outgoing lead has a work-order-level shift on this work order that has not ended. A work-order-level shift is one that covers every current line of the work order, which is what the Schedule's Entire work order drop creates. A shift on only some lines does not show the prompt.

## Non-code sections

- **Status line:** unchanged — "In development: PRD v33, 2026-09-28. Remaining design items with Branko are tracked on the review child page." (the page itself is v48).
- **Change Log (section 10):** an empty table of 9 blank rows in both versions; it names no change.
- **Key Decisions / Business case:** v48 adds to the Core ShopView bullet: "Imported work orders are the one exception: they open in List only (S1-R13a, S1-R13b)."
- **Story 4 preconditions:** v48 — "The lead technician cannot be changed in Invoiced, Paid, or Imported." → "…in Invoiced or Paid."
- **Design updates list:** v43 — "Filtered-empty results with Clear filters, …" → "Filtered-empty results (the List's empty state, S1-N1), …".
- **Section 9 messages table:** v43 rewrites the S1-N1 row to the new messages; v48 deletes the S4-N9 row.
- **New context notes:** v44 (S3-R20a/b, SQ-11 answer of 24 Sep), v46 (S4-R8: Schedule-shift technicians do not count as explicit, SV-11128), v48 (S1-R13a/b: Imported is List-only; Sasha agreed 24 Sep; "@chris confirmed it on 2026-10-12").
- **Glossary / Terminology:** unchanged.

## Every changed non-code line (script output)

```diff
-- The existing **filter views** (the tabs on the left — All, Work Orders, Estimates, Completed) and the filter bar (search, status, assigned to me, and so on) apply the same way in every display option. Switching display option never changes *which* work orders are shown, only *how* they are laid out.
+- The existing **filter views** (the tabs on the left — All, Work Orders, Estimates, Completed) and the filter bar (search, status, assigned to me, and so on) apply the same way in every display option. Switching display option never changes *which* work orders are shown, only *how* they are laid out. Imported work orders are the one exception: they open in List only (S1-R13a, S1-R13b).
-**Negative Cases:**
+*\* Context note (S1-R13a, S1-R13b): imported work orders are kept apart from regular work orders and have no lead technician, so they cannot be grouped by technician or placed on a board. Engineering proposed List-only on 2026-09-17 and Sasha agreed on 2026-09-24 in the comments on this page; @chris confirmed it on 2026-10-12. S4-N9 (a reassign tooltip on imported work orders) is removed because Board View and Tech View never show them.*
+**Negative Cases:**
+> *\* Context note (S3-R20a, S3-R20b): follows Sasha's answer to SQ-11 on Sep 24: technicians not eligible at a location simply do not show there. A pin only counts at locations where the technician is enrolled.*
-- The work order status is Estimate, Approved, In Progress, Review, Complete, or Declined. The lead technician cannot be changed in Invoiced, Paid, or Imported.
+- The work order status is Estimate, Approved, In Progress, Review, Complete, or Declined. The lead technician cannot be changed in Invoiced or Paid.
+*\* Context note (S4-R8, SV-11128): "Explicitly assigned" means the line's own technician, set through Edit Line. A technician who is on a line only because of a Schedule shift, whether the shift was dropped on that line or on the entire work order, does not count: the line follows the incoming lead like any other line, and the shift technician stays on the line's technician list. This is how a lead technician change works on the work order screen today.*
-- Filtered-empty results with Clear filters, and an organization with no technicians, in both new views.
+- Filtered-empty results (the List's empty state, S1-N1), and an organization with no technicians, in both new views.
-| Imported work order, reassignment not allowed (S4-N9) | “The lead technician can’t be changed on an imported work order.” | Tooltip on disabled action; drag not offered |
-| No work orders match filters (S1-N1) | “No work orders match your filters” + Clear filters | Existing List empty state and clear-filter behavior in all display options |
+| No work orders match filters (S1-N1) | “No work orders match these filters” + “Try removing a filter to widen your results.” + Clear all filters. Search only: “No work orders match the search "{search}".” | Existing List empty state and clear-filter behavior in all display options |
```

Child page 853901313 (Review Decisions): body byte-identical to our 29 Sep copy; last version v13, 2026-09-29 16:42 UTC. No other descendant changed (Run log 853245959, last 21 Sep).
