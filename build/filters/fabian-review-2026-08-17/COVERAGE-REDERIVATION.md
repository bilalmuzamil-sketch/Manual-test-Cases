# Filters — Fabian redesign — COVERAGE RE-DERIVATION (spec v21 · epic SV-8785)

Re-derived **both directions** against the CURRENT spec v21 + the 33 epic stories + the Figma
"earlier exploration" nodes (superseded). Focus = what the Fabian review **changed or added**;
settled items (page search internals, persistence/URL/API behaviour that did not change) are not
re-litigated. Live suite = **120** (ours 115 / foreign 5 = Ahtasham C43576–C43580, Story 14).

Legend: **COVERED** (no change) · **UPDATE** (labels/expectation/anchor changed) · **REWRITE**
(behaviour materially changed) · **REPURPOSE** (case asserted a REMOVED feature; no delete
authorised, so re-scoped to a current spec-backed assertion) · **NEW** (add_case).

## A. Requirement/story → case (forward direction)

| v21 story (Jira) | Key requirements | Verdict → case(s) |
|---|---|---|
| **Story 1 Layout & Visibility** (SV-9268 layout, SV-9269 no-collapse) | S1-R1 chips in toolbar row right-aligned; S1-R2 action-group order; S1-R3 wrap; S1-R4 no collapse control; S1-R5 three WO chips; S1-R6 chip = icon+name+chevron (toggle none); S1-R7/R8 app-wide, no filter added/removed | REWRITE FLT-BAR-01 (S1-R1), FLT-BAR-02 (S1-R5/R6); REWRITE FLT-COLL-01 (S1-R4 no collapse); REPURPOSE FLT-COLL-02→S1-R2, FLT-COLL-03→S1-R3, FLT-COLL-04→S1-R7, FLT-COLL-06→S1-R8; NEW FLT-LAYOUT-01 (S1-R1/R7 pages-without-tabs) |
| **Story 2 Status Filter** (SV-8787) | S2-R1..R7, Imported exclusive | COVERED FLT-STAT-01..07 (behaviour unchanged; "shown on All tab only" is Story 9) |
| **Story 6 Asset on Site** (SV-9275) | S6 single-select **checkmark** panel (was Yes/No dropdown) | REWRITE FLT-ASSET-01 (S16-R4 checkmark), UPDATE FLT-ASSET-03; COVERED FLT-ASSET-02/04/05/06/07 |
| **Story 6a Assigned to Me** (SV-9271) | S6a toggle chip, no chevron/panel, on/off, active no value text, no X-circle, scopes to me | **NEW FLT-ASSIGN-01/02/03**; NEW mobile REPURPOSE FLT-MOB-05→S12-R12 |
| **Story 7 Chip States** (SV-9273, SV-8792) | S7-R1..R9 pill states, X-circle on selected-hover, multi-value "first, +N", truncation, toggle no chevron | COVERED FLT-CHIP-01 (S7-R5), FLT-CHIP-02 (S7-R7); NEW FLT-CHIP-07 (S7-R6 X-circle + S7-R8 truncation) |
| **Story 8 Clearing & Empty** (SV-9274, SV-8793) | S8-R1 **NO global Clear filters**; per-chip / Clear selection; empty state | REWRITE FLT-CHIP-03/04 (no global clear); UPDATE FLT-EMPTY-02 (S8-R4/R5); COVERED FLT-CHIP-05, FLT-EMPTY-01/03 |
| **Story 9 Tab Behaviour** (SV-9272, SV-8794) | S9-R1 4 tabs, My WO removed, **Work Orders tab new**; S9-R2/R3/R4 pre-filters; S9-R5 Status chip All-only, Assigned/Asset every tab | REWRITE FLT-TAB-01 (three chips on All), FLT-TAB-04→S9-R2 new WO tab; UPDATE FLT-TAB-02/03 (Assigned/Asset shown; **greyed-vs-hidden CONFLICT flagged**), FLT-TAB-05; UPDATE FLT-BAR-03 (S1-N1/S9-R5); COVERED FLT-TAB-06 (default tab, Branko-ruled) |
| **Story 10 Persistence** (SV-8795) | S10 server-side, per-user, cross-device | UPDATE FLT-PERS-01 (drop bar/collapse-state); COVERED FLT-PERS-02..07 |
| **Story 11 URL + banner** (SV-8796, SV-9277) | S11-R1..R8 URL; **S11-R7 shared-link banner** (NEW) | **NEW FLT-BANNER-01** (S11-R7 appearance/copy); COVERED FLT-URL-01..06 (FLT-URL-05 = "Back to my view" S11-R7a) |
| **Story 12 Mobile** (SV-9278, SV-8797) | S12 three stacked rows; **no combined "All filters" drawer**; per-filter bottom sheet; scrim; deferred apply "Apply filters" | REWRITE FLT-MOB-01 (stacked rows), FLT-MOB-02 (per-filter sheet, no drawer); UPDATE FLT-MOB-03/04 (deferred apply), FLT-MOB-07 (checkmark sheet), FLT-MOB-08 (no Clear filters); REPURPOSE FLT-MOB-05→S12-R12 (toggle in row), FLT-MOB-06→S12-R8/N2 (scrim/dismiss); COVERED FLT-MOB-09/10/11 |
| **Story 13 Page Search** (SV-8798) | S13 unchanged; **S13-E1 collapse edge REMOVED** | REPURPOSE FLT-PSRCH-13 (S13-E1 gone → S13-R14 retention); COVERED FLT-PSRCH-01..12, 14 |
| **Story 14 Global search removal** (SV-8799) | S14 app-wide | COVERED FLT-PSRCH-07/12 (ours) + **5 foreign** C43576–C43580 (Ahtasham) — hands-off |
| **Story 16 Panel Types** (SV-9276) | S16-R1 checkbox; R2 searchable; R3 searchable+pills; R4 single-select checkmark; R5 date range; R6 Clear selection; R7 anchored popover; N1 No matches | REPURPOSE the 23 removed entity-filter cases (Customer/Lead Tech/Advisor) → S16-R2/R3/R6/R7/N1 page-agnostic; UPDATE FLT-RPTS-23 (S16-R5 v21 preset list); NEW FLT-PANEL-01 (S16-R7 anchored popover, click-outside keeps selection) |
| **Parts/Reports rollout** (SV-9279, SV-8786) | S1-R7/R8 relocate existing filters, none added/removed | COVERED FLT-PARTS-01/09/11/12/13/14, FLT-RPTS-01/21/22/23 (behavioural + "confirm live"; per-view list PENDING from engineering) |

## B. Case → requirement (reverse direction) — the REMOVED features

| Case(s) | Asserted (v19) | v21 status | Action |
|---|---|---|---|
| FLT-CUST-01..09 (C29566–74) | Customer chip on Work Orders | **REMOVED from WO** (v1.7 removes Story 3); panel survives as S16-R2/R3 entity panel | REPURPOSE (removal note + page-agnostic entity-panel behaviour, "confirm live which pages") |
| FLT-TECH-01..07 (C29575–81) | Lead Technician chip on WO | **REMOVED** (v1.7 Story 4) | REPURPOSE |
| FLT-ADV-01..07 (C29582–88) | Service Advisor chip on WO | **REMOVED** (v1.7 Story 5) | REPURPOSE |
| FLT-COLL-01..06 (C29601–05, C43590) | collapse/expand toggle + indicator | **REMOVED** (S1-R4; v1.7 removes S1-R4/R5/R6, S7-R4/R5/N2) | REWRITE FLT-COLL-01 (no collapse), REPURPOSE 02–06 to live S1 assertions |
| FLT-CHIP-03/04 (C29597/98) | global "Clear filters" button | **REMOVED** (S8-R1; v1.7 removes S8-N1) | REWRITE (no global clear; per-chip only) |
| FLT-CHIP-06 (C29600) | Status + **Customer** together | Customer no longer a WO filter | REWRITE (Status + Asset on Site together) |
| FLT-TAB-04 (C29611) | My Work Orders tab | **REMOVED** (S9-R1; replaced by Assigned to me chip) | REWRITE → S9-R2 new Work Orders tab |
| FLT-MOB-01/02 (C29621/22) | mobile "All Filters" combined drawer | **REMOVED** (S12-R7 "no combined All filters drawer") | REWRITE (per-filter bottom sheet) |
| FLT-MOB-05/06 (C29625/26) | Customer/Lead Tech/Advisor on mobile | removed from WO | REPURPOSE → S12-R12 toggle / S12-R8 scrim |
| FLT-PSRCH-13 (C38903) | collapsing filter bar keeps search (S13-E1) | **S13-E1 REMOVED** (no collapse) | REPURPOSE → S13-R14 retention |

## C. NEW cases (add_case) — genuinely new v21 behaviour not covered

| Internal | Title (≤80) | Anchor / story |
|---|---|---|
| FLT-ASSIGN-01 | Assigned to me is a toggle chip with no arrow that turns on and off | S6a-R1/R2 (SV-9271) |
| FLT-ASSIGN-02 | Turning Assigned to me on highlights the chip with no value and no clear X | S6a-R3/R4 (SV-9271) |
| FLT-ASSIGN-03 | Assigned to me narrows to my work orders on top of the tab and filters | S6a-R5/R6 (SV-9271) |
| FLT-BANNER-01 | A shared-link banner appears above the tabs when you open a filtered link | S11-R7 (SV-9277) |
| FLT-TAB-WO-01 | The Work Orders tab pre-filters to Estimate, Approved and In Progress | S9-R2 (SV-9272) |
| FLT-LAYOUT-01 | Filter chips sit in the toolbar row; on pages with no tabs, the title row | S1-R1/R7 (SV-9268) |
| FLT-LAYOUT-02 | Toolbar order is search, filter chips, icon actions, then the main button | S1-R2 (SV-9268) |
| FLT-CHIP-07 | A selected chip shows an X to clear on hover and shortens a long value | S7-R6/R8 (SV-9273) |
| FLT-PANEL-01 | A filter panel opens under its chip and stays applied when you click away | S16-R7 (SV-9276) |

## D. Deliberate decisions / risks
- **Greyed-vs-hidden Status chip on Estimates/Completed (FLT-TAB-02/03, C29609/C29610):** v21 S9-R5
  says the Status chip is **hidden** on those tabs; a **recorded QA-lead ruling 2026-07-30** said
  greyed-out/pre-filled. Per Rule 33 a recorded ruling is not silently reversed — **verdict HELD,
  conflict flagged to the QA lead** (OUTSTANDING + questions). These cases update only the
  tab-model structure (Assigned/Asset chips shown) and provenance; the Status-visibility assertion
  is left as recorded pending his ruling.
- **23 removed entity-filter cases repurposed, not deleted** (no delete authorised). They carry
  real, current, spec-backed panel behaviour (S16-R2/R3/R6/R7/N1) but are now **page-agnostic** and
  overlap each other → flagged **MERGE/WEAK-KEEP** in the Ruthless Usefulness Audit for a future
  authorised consolidation once the engineering per-view filter list lands.
- **Per-view filter list PENDING from engineering** (S1-R8, S13-R23) → Parts/Reports cases stay
  behavioural + "confirm live".
- **Build deferred** → every touched/new case carries `AUTOMATION: Not available on Build to test
  Yet - Last checked 8/17/2026` (Rule 69) and no build sentence in provenance.
