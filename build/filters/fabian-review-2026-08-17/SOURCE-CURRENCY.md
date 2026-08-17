# Filters — Fabian design-review reconciliation — SOURCE-CURRENCY

**Pass:** `build/filters/fabian-review-2026-08-17/` · worker = TestRail user id 3 (Bilal Muzamil)
**Sources read at pass start:** 2026-08-17 (all times UTC unless noted)
**Epic:** SV-8785 · **PO:** Branko Cicovic · **TestRail group:** 4110 · **Run (not ours):** 352

This pass reconciles the Filters suite to the **Fabian app-wide filter redesign** (Confluence
spec v20/v21, epic stories SV-9268–SV-9279). Build verification is **deliberately deferred** this
pass (app not opened), so every case touched carries the transitional marker
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (Standing Rule 69) and its
Rule-54 provenance line names documents only (sentence 1), with sentence 2 omitted.

| # | Source | Identifier | Version / last-edited | Checked | Verdict |
|---|---|---|---|---|---|
| a | **Filters spec (Confluence)** | page **572030978** "Filters" | **v21**, created 2026-08-14T13:00:13Z (in-body field reads "Version: 1.7" — Rule 31 trap (a), ignored) | 2026-08-17 | **STALE → reconciled here.** Our id-map refs pinned **v19 (2026-08-06)**. |
| b | **Epic + child stories** | **SV-8785**, 33 children | counted two ways: `parent=SV-8785` → 33 and `"Epic Link"=SV-8785` → 33 (equal, no paging remainder) | 2026-08-17 | **STALE → reconciled here.** 12 NEW redesign stories SV-9268–SV-9279 + SV-9041 not previously mapped. |
| c | **Design / Figma** | file `DR4gEODShYgJqkozs3mF5q`, nodes 11817-27678, 11884-16885, 11903-10573, 11829-8908 | fetched HTTP 200 (nodes endpoint) | 2026-08-17 | **CURRENT-BUT-SUPERSEDED.** These four are the **earlier explorations** (spec v21 labels them so). They still show the OLD 5-chip model (Customer / Lead Technician / Service Advisor / My Work Orders / Clear filters). Per Rule 32 latest-wins + Rule 57, the **v21 spec + the Claude design supersede them** — the spec RESOLVES the divergence itself (it explicitly removes Stories 3/4/5), so no PO question is owed on it. |
| c2 | **Claude design (primary)** | `claude.ai/design/p/fac6efcf-…?file=Filters.html` | referenced by every v21 story as `Design:` | not directly fetchable (claude.ai design page) | **PARTIAL.** Not fetched directly; **the v21 spec prose captures its labels, pixel specs, colours and copy in full** (e.g. "Apply filters", "Clear selection", "Back to my view", "Viewing a shared link - your own saved filters aren't applied", "Search {filter name}", "Type to search", "MM/DD/YYYY – MM/DD/YYYY", presets Today/Yesterday/This week/This month/Last month/This quarter/This year/Custom). Labels are authored from the spec; anything not pinned by spec is marked "confirm live". |
| d | **Engineering tech plan** | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` (+ eng handover "SV-8785-app-wide-filter-redesign" 2026-08-10, cited in existing refs) | 2026-07-30 sync | 2026-08-17 | **CURRENT for the pre-redesign baseline.** The app-wide redesign it foreshadowed is now the v21 spec; where they differ, the v21 spec wins (Rule 30 — tech plan informs, never overrules). Per-view filter list is **still PENDING from engineering** (spec S1-R8 / S13-R23 say so). |
| e | **PO answers (Branko)** | `branko-answers-2026-07-17/-07-20/-07-31/-08-04`, `branko-questions-2026-08-05` | through 2026-08-05 | 2026-08-17 | **SUPERSEDED where in conflict.** The v21 spec (Fabian/Branko, 2026-08-14) is the newest authoritative product source and reverses earlier Branko answers that assumed the 5-chip model, the collapse toggle and the combined "All Filters" mobile drawer. Newest = v21 spec. |

## The headline delta (v19 → v21, "Removed in v1.7")

The Fabian review is a **fundamental redesign of the Work Orders filter model**, not an increment:

1. **Chips move INTO the toolbar row**, right-aligned, same row as the tabs (S1-R1) — there is no
   separate filter bar (was: a filter bar below the tab row).
2. **The collapse/expand toggle is REMOVED** — "The filter chips are always visible. There is no
   control to hide, collapse or expand them, on any page or any breakpoint" (S1-R4). The
   collapsed-state active-filter indicator is removed too.
3. **Work Orders is reduced to THREE filters: Status, Assigned to me, Asset on Site** (S1-R5).
   **Customer, Lead Technician and Service Advisor are removed as Work Orders filters** (v1.7 removes
   Stories 3/4/5). Their searchable multi-select panel survives as the Story-16 entity-filter panel
   used elsewhere.
4. **"Assigned to me" is a NEW toggle chip** — leading icon, label, no chevron, no panel; on/off;
   replaces the removed **My Work Orders tab** (Story 6a / SV-9271).
5. **The global "Clear filters" button is REMOVED** — a user clears one filter at a time, from the
   chip's X-circle or from "Clear selection" in the panel (S8-R1 / SV-9274).
6. **Asset on Site is a single-select panel with a checkmark** on the selected row (S16-R4 / SV-9275),
   not radio buttons.
7. **Tab model: four tabs — All, Work Orders, Estimates, Completed** (S9-R1). **My Work Orders is
   removed**; the **Work Orders tab is new** and pre-filters to Estimate/Approved/In progress
   (S9-R2 / SV-9272). Status chip is shown on the **All tab only** (S9-R5).
8. **A shared-link banner is NEW** — full-width info banner between the app header and tabs, copy
   "Viewing a shared link - your own saved filters aren't applied", with "Back to my view"
   (S11-R7 / SV-9277).
9. **Mobile: the combined "All filters" drawer is REMOVED** — each chip opens its own bottom sheet
   with deferred apply via an "Apply filters" button; three stacked rows (S12 / SV-9278).
10. **Filter Panel Types is a consolidated contract** — 5 panel types S16-R1..R5 (SV-9276).
11. **App-wide rollout** — the toolbar-row layout applies to every page with a filterable table;
    existing per-page filters are relocated and restyled, none added or removed (S1-R7/R8, SV-9279).

## OUTSTANDING (source side)
- **Per-view filter list PENDING from engineering** (spec S1-R8, S13-R23). Until it lands, QA has no
  baseline for exactly which chips belong on which Parts view / Report — Parts/Reports coverage stays
  behavioural + "confirm live".
- **Claude design not directly fetched** (claude.ai). Authored from the spec prose, which is complete
  for labels; anything unpinned is marked "confirm live".
- **Build verification deferred** (app not opened this pass) — all touched cases carry the Rule-69
  transitional marker; a later sync build-verifies and lifts markers to READY.
