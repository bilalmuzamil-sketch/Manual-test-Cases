# Global Search — coverage re-check (2026-09-22)

Asked by the QA lead: does Global Search have complete test-case coverage based on the UPDATED sources?

## Method
- Read the two most recent coverage audits (`FULL-COVERAGE-AUDIT-2026-09-18.md`,
  `PER-TAB-RANKING-COVERAGE-2026-09-20.md`) and the parked state (`PARKED-2026-09-22.md`).
- Live-read the suite from TestRail (group 6720, 24 sections, 205 cases) and matched each
  previously-recommended gap to a live case by content (titles carry no jargon, Rule 7/9).

## Result — every gap the last two audits flagged has since been authored
| Gap (source) | Recommended | Live case now | 
|---|---|---|
| PERM-A — exact-ID of a forbidden record must not surface (§9+§6.2) | 2026-09-18 | **C55718** |
| PERM-B — contact-field match hidden without parent-company access (§4+§9) | 2026-09-18 | **C55719** |
| PERM-C — role missing several bundles hides all, keeps the rest (§9) | 2026-09-18 | **C55720** |
| PERM-D — forbidden record must not leak via fuzzy (§9+§7) | 2026-09-18 | **C55721** |
| SL-1 — customer open-WO-count magnitude (more opens ranks higher) (§6.1) | 2026-09-18 | **C55722** |
| SL-2 — name match ranks above secondary-field match, generalised (§6.1) | 2026-09-18 | **C55723** |
| Per-tab prefix rule on Parts / Vendors / Assets (SV-10279) | 2026-09-20 | **C72120 / C72121 / C72122** |

Against the sources **as last verified (PRD 576978945 v1.5, read live 2026-09-17, unchanged since
2026-09-08; epic SV-9160)**, the palette suite is coverage-complete: no requirement-level gap remains.

## The only remaining uncovered items are OPEN PO QUESTIONS (not authorable — Rule 58)
- **PERM-E** — record-level "own records only" scoping (needs the Custom Roles spec / PO).
- **PERM-F** — page-search (in-page list) permission parity (SV-9306 obsolete, verify task SV-9311 open).
- Quick-action button permission gating (§5.4, spec silent); location / workplace scoping
  (`OPEN-QUESTION-location-scope-2026-09-18.md`).
- Parked PO questions: PO-GS-5 (telemetry in V1?), PO-GS-6 (vendor-invoice badge 2 vs 3 states),
  OQ-3 (does the AI "ask a question" placeholder ship in V1?).

## 🔴 Currency NOT re-confirmed this session (Rule 12/31/110)
The Atlassian connector timed out on all five attempts (Confluence CQL, Jira JQL, getConfluencePage)
on 2026-09-22, so I could NOT re-confirm that PRD 576978945 is still at v1.5 or that epic SV-9160 has
gained no new stories since 2026-09-18. The completeness verdict above holds **for the v1.5 source
version**; if the PRD/epic moved in the last few days, that delta is unchecked. Re-run the currency
check when the connector is back.

## Not part of V1 palette completeness (separate universes)
- V1-regression suite for GS V2 lives in sections 6769 (66) and 8056 (1); "Out of V1 Scope" 6767 (1);
  telemetry 6768 (0). Rule 109: for the comparison suite the V1 product at a commit is the spec.
- Still parked from before: the Rule-113 verbatim-quote sweep over the remaining ~35 GS cases (a
  quality task on existing cases, not a coverage gap).
