# Filters — Fabian redesign — POST-WRITE ASSERTION RE-AUDIT (Common-core §2.10)

**Population written this pass:** 69 cases (9 add_case + 60 update_case). All 69 are **material**
(the expected BODY changed on every one — there were no provenance-only re-stamps this pass), so
all 69 were read against their cited source. Method: for each, quote the new assertion back to a
named v21 anchor (§11.2 quote-back gate); confirm the assertion is reachable by the case's own
steps; confirm the content belongs to the case's subject; diff note paragraphs, not only numbered
assertions.

## Result: 0 unsourceable assertions · 0 mis-landed content · 1 assertion deliberately HELD

Every assertion traces to a v21 anchor read live 2026-08-17:

| Assertion (sample) | Case(s) | Source (spec v21, read 17 Aug 2026) |
|---|---|---|
| Three WO chips: Status, Assigned to me, Asset on Site, in that order | C29558, C29608 | S1-R5 |
| Chips in the toolbar row, right-aligned; no separate filter row | C29557, C43846 | S1-R1 |
| No control to hide/collapse/expand chips, any page or breakpoint | C29601–05, C43590 | S1-R4 |
| Assigned to me = toggle chip, no chevron, no panel, no X-circle | C43841, C43842 | S6a-R1/R3/R4 |
| No global "Clear filters"; clear per chip / "Clear selection" | C29597, C29598, C29628, C38907 | S8-R1, S8-R2 |
| Asset on Site = single-select list, checkmark on chosen row | C29589, C29591, C29627 | S6-R3, S16-R4 |
| Four tabs All/Work Orders/Estimates/Completed; My WO removed | C29608, C29611, C43845 | S9-R1 |
| Work Orders tab pre-filters Estimate/Approved/In Progress | C43845 | S9-R2 |
| Shared-link banner copy + "Back to my view" | C43844 | S11-R7, S11-R7a |
| Mobile: no combined "All filters" drawer; per-filter bottom sheet; deferred "Apply filters" | C29621–24, C29626 | S12-R7/R8/R13 |
| Entity filters use searchable multi-select panel with pills / "No matches" | C29566–74, C29575–88 | S16-R2/R3/N1 |
| Date-range presets Today…Custom; custom applies on 2nd date | C38882 | S16-R5 |

**Reachability:** every numbered assertion is reachable by its case's own steps (spot-checked on the
new cases; the toggle/panel/tab steps drive the exact controls asserted).

**Content-belongs check:** no case names a screen, column set or figure from another feature. The
23 repurposed entity cases were the highest risk (they moved from "Work Orders" to "any page with
this filter") — each now carries a page-agnostic precondition and a removal note; none asserts a
Work Orders location it no longer has.

**Note-paragraph diff:** the only note-block additions are (a) the "confirm live which pages" hedge
on repurposed/pending cases (honest, not a waiver) and (b) the explicit **HELD** note on C29609/
C29610. **No "known and accepted / on purpose for now" waiver was introduced.**

## The one HELD assertion (deliberately not resolved — Rule 33)
**C29609 (FLT-TAB-02) / C29610 (FLT-TAB-03)** — Status chip on Estimates/Completed tabs. v21 S9-R5
says **hidden**; a **recorded QA-lead ruling 2026-07-30** said **greyed-out/pre-filled**. This is a
tier-(b) ruling vs a later spec change — not silently reversed. These two cases update only the
tab-model structure (Assigned to me + Asset on Site chips shown) and the provenance; the
Status-visibility verdict is left as an OPEN POINT on the case and **flagged to the QA lead**
(OUTSTANDING + questions). This is the exact scar the workspace records (C29609/C29610 flipped off a
ruling in an earlier pass); it was **not** repeated here.
