# Filters — coverage re-derivation both directions vs spec v21 (2026-08-17)

**Pass:** `build/filters/currency-2026-08-17/` · Epic SV-8785 · spec Confluence **v21** · 124 our cases.
This confirms the fabian-review reconciliation (earlier today) and sweeps the version pins.

## Method
Both directions per Rules 43/45, over the whole live suite (129 in group 4110 = **124 ours** +
5 foreign Ahtasham). Live spec fetched today; its 138 requirement anchors extracted; every anchor
cited by a case checked for existence in v21 (Rule 31 trap (c): existence is necessary, not
sufficient — key anchors' TEXT was also read and confirmed to support the assertion).

## Direction 1 — requirement → case (are v21 requirements covered?)
The v21 redesign delta (v19 → v21, "Removed in v1.7") is a fundamental redesign. The fabian pass
authored/rewrote 69 cases to it. This pass re-confirmed each delta item has coverage:

| v21 redesign item (story) | Covered by |
|---|---|
| Chips in the toolbar row, no separate bar (SV-9268 / S1-R1,R4) | C29557, C29558 (fabian) |
| Collapse/expand toggle REMOVED everywhere (S1-R4) | C29602, C29603, C29605, C29613, C29621, C38903, C43562, C43590 (assert the control is ABSENT) |
| Work Orders reduced to 3 filters; Customer/Lead Tech/Service Advisor removed (SV-9270 / S1-R5) | C29558 + the 23 entity cases repurposed page-agnostically (C29566–C29588) |
| "Assigned to me" NEW toggle chip (SV-9271 / S6a) | C43841, C43842, C43843, C29625 |
| Asset on Site single-select checkmark (SV-9275 / S16-R4) | C29590, C29592–94, C38878 (this pass, re-stamped) |
| Status multi-select + Imported exclusive (S2) | C29561–65, C38877 (this pass) |
| Global "Clear filters" REMOVED; per-chip clear (SV-9274 / S8-R1) | C29598, C29599, C29607, C29628, C38907 (assert ABSENT) |
| Four tabs; My Work Orders removed; Work Orders tab added (SV-9272 / S9) | C29608, C38876, C38881, C29609/29610 |
| Shared-link banner NEW (SV-9277 / S11-R7) | C38879, C38896, C29618 |
| Mobile per-chip bottom sheets, deferred "Apply filters" (SV-9278 / S12) | C29621–27, C29629, C29630, C43563 |
| Panel-type contract (SV-9276 / S16) | C29566–C29588 (entity panels), C38882 |
| App-wide rollout; per-view filter list (SV-9279 / S1-R7/R8) | C38904–06, C38908–11 (HOLD — per-view list PENDING from engineering) |

**No uncovered v21 requirement found** beyond the deliberately-HOLD per-view rollout (owed by
engineering — spec S1-R8 / S13-R23 say the per-page filter set is "the set that page provides
today", which cannot be pinned until engineering publishes the list).

## Direction 2 — case → requirement (orphaned or stale-anchored cases?)
- **Every anchor cited by a case exists in v21** (spec has S1–S16, incl. S10-R4, S13-R22/R23/R24,
  S14-R5/R6, S16-R4, S8-R1, S9-R5, S11-R7 — all present and semantically supporting their cases).
- **0 orphaned cases** (no case cites a requirement removed in v21).
- **C38909** legitimately keeps a historical note "S1-R3 was added in Confluence version 19" — that
  is a fact about when the type-icon rule first appeared, deliberately NOT changed to v21.
- **1 spec-silent case (C38876, default tab)**: v21 (like v19) has no numbered requirement for the
  default/last-used tab; sourced from Branko's answer + tech plan. Valid under v21 (spec still
  silent) — no requirement reference invented (Rule 12).

## Contradiction sweep (Rule 28) — result: 0 live contradictions
Every reference to a removed old-model control (collapse toggle / My Work Orders tab / global Clear
filters button) is a **negative assertion confirming the redesign removed it** — not a stale
assertion of the old model. This pass changed **0 assertion bodies**, so it introduced no new
contradiction; fabian's earlier re-sweep (0) holds.

## Stale-version cases found and fixed this pass
**55 untouched cases still citing spec v19** (41 READY + 4 EXPECT-FAIL + 10 HOLD). All confirmed
behaviourally valid under v21 (their behaviour was unchanged by the redesign — panel behaviour, URL,
API, persistence, page-search, Parts/Reports HOLDs). Re-stamped to v21. No content-stale case found.
