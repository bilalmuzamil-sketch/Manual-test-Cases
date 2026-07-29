# SBR (Sales By Representative) — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **109 active SBR cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: SBR-NAV-02 → SBR-NAV-01; SBR-DATE-03 → SBR-PERS-04; SBR-LOC-02 → SBR-PERS-04; SBR-TYPE-01 → SBR-TYPE-02; SBR-TYPE-03 → SBR-STAT-04; SBR-STAT-03 → SBR-STAT-04; SBR-ROW-04 → SBR-ROW-02; SBR-BADGE-03 → SBR-BADGE-01; SBR-CALC-04 → SBR-CALC-02; SBR-TOT-04 → SBR-TOT-01; SBR-LINK-02 → SBR-LINK-01; SBR-DEACT-01 → SBR-DEACT-07; SBR-UNAS-03 → SBR-UNAS-02; SBR-COL-02 → SBR-COL-01; SBR-COL-06 → SBR-COL-01; SBR-STATE-02 → SBR-STATE-01.
> Cut (retired, body kept locally): SBR-SORT-06 (no-op sort assertion); SBR-EXP-09 (px font-tier minutiae).


> Report Suite project — SBR report. Coverage doc authored 2026-07-22 from
> `specs/sbr-sales-by-representative.md` (spec revision `_1`, change log through 2026-07-21).
> SPEC-ONLY authoring (no designs yet). **127 cases / 23 sections**, all `viu_status: VIU-Pending`.
> Case source:
> `cases/cases-sbr-A-access-filters.json` (22),
> `cases/cases-sbr-B-rows-badge-calcs-totals-sorting.json` (30),
> `cases/cases-sbr-C-links-deactivation-unassigned-columns-persistence.json` (28),
> `cases/cases-sbr-D-exports-assignments-states-mobile-visual-worep-api.json` (47).
> **Provenance note:** A–C are the rescue-committed files from the interrupted authoring
> worker (2026-07-22, commit ca6107f); D was authored after a bullet-by-bullet gap
> analysis of A–C against the spec (see "Gap analysis" below). LOCAL ONLY — nothing
> pushed to TestRail.

## Gap analysis (what A–C did NOT cover — all closed by D)

The rescued A–C set (80 cases) fully covered Stories 1–6, 8–13 (except S13-N4),
20–23, and the §3 calculation contract. It had **no coverage at all** for:

- **Story 14 — PDF and CSV exports** (all 27 bullets) → SBR-EXP-01..16.
- **Story 15 — Sales Rep Assignments CSV export** (all bullets except S15-N1, which
  SBR-PERM-02 already carried) → SBR-ASGN-01..06.
- **Story 16 — Loading, empty, and error states** (S16-R1/R2/R3/R5/N1; only S16-R4 was
  referenced in passing by SBR-DATE-03/SBR-TOT-02) → SBR-STATE-01..04.
- **Story 17 — Mobile usability** (S17-R1/R2/R3/R5/R6/N1; only S17-R4 was touched by
  SBR-TOT-03) → SBR-MOB-01..03.
- **Story 18 — Visual conformance & accessibility** (S18-R1/R2/R3/R5/R7.1–R7.6/R9/R10/
  R11/R12/N1; A–C only referenced R4/R6/R6a/R7.2/R7.5/R8 incidentally) → SBR-VIS-01..05.
- **Story 19 — Work Order Sales Rep assignment** (all 11 bullets) → SBR-WO-01..06.
- **S13-N4** (pre-check-failed fallback dialog) → SBR-DEACT-09.
- **The server-side behaviors** (Standing Rule 4 API section, mirroring the other five
  reports): lazy per-rep drill-down, server sort, server-computed grand totals,
  server-generated exports, server-side row cap, deactivation pre-check → SBR-API-01..06.
- **§7 message rows** for load-failure, export failures, row-cap, and the Assignments
  toasts (only the empty-state and deactivation-failure strings were carried by A–C).

## Section breakdown

| Section (TestRail leaf under "Report Suite") | Cases |
| --- | --- |
| SBR — Access & Navigation | SBR-NAV-01..03 (3) |
| SBR — Permissions | SBR-PERM-01..03 (3) |
| SBR — Date Range Filter | SBR-DATE-01..04 (4) |
| SBR — Product Type Filter | SBR-TYPE-01..03 (3) |
| SBR — Invoice Status Filter | SBR-STAT-01..05 (5) |
| SBR — Location Filter | SBR-LOC-01..04 (4) |
| SBR — Rep Rows & Tree | SBR-ROW-01..04, SBR-TREE-05..09 (9) |
| SBR — Payment Status Badge | SBR-BADGE-01..03 (3) |
| SBR — Inv. Hrs & Calculations | SBR-CALC-01..08 (8) |
| SBR — Subtotal & Totals | SBR-TOT-01..04 (4) |
| SBR — Sorting | SBR-SORT-01..06 (6) |
| SBR — Links & Navigation | SBR-LINK-01..05 (5) |
| SBR — Staff Deactivation | SBR-DEACT-01..09 (9) |
| SBR — Show Unassigned | SBR-UNAS-01..04 (4) |
| SBR — Column Selector | SBR-COL-01..06 (6) |
| SBR — Persistence | SBR-PERS-01..05 (5) |
| SBR — Exports | SBR-EXP-01..16 (16) |
| SBR — Sales Rep Assignments Export | SBR-ASGN-01..06 (6) |
| SBR — Loading, Empty & Error States | SBR-STATE-01..04 (4) |
| SBR — Mobile | SBR-MOB-01..03 (3) |
| SBR — Visual Conformance & Accessibility | SBR-VIS-01..05 (5) |
| SBR — Work Order Sales Rep | SBR-WO-01..06 (6) |
| SBR — API | SBR-API-01..06 (6) — Standing Rule 4 (backend-behavior cases, generically worded, no invented endpoints) |
| **Total** | **127** |

## Requirement → case map (every bullet)

### Story 1 — Access the Sales By Representative Report
| Bullet | Case(s) |
| --- | --- |
| S1-R1 | SBR-NAV-01, SBR-PERM-01 |
| S1-R2 | SBR-NAV-01 |
| S1-R3 | SBR-NAV-01 |
| S1-R4 | SBR-NAV-01 |
| S1-R5 | SBR-NAV-02 |
| S1-R6 | SBR-NAV-02 |
| S1-R7 (+ §1 naming note) | SBR-NAV-03 |
| S1-N1 | SBR-PERM-02 |

### Story 2 — Filter by date range
| Bullet | Case(s) |
| --- | --- |
| S2-R1 | SBR-DATE-01 |
| S2-R2 | SBR-DATE-01 |
| S2-R3 | SBR-DATE-02 |
| S2-R4 | SBR-DATE-03 |
| S2-R5 | SBR-DATE-04, SBR-EXP-03, SBR-EXP-04 (header strips) |
| S2-R6 | SBR-DATE-02 |
| S2-R7 | SBR-DATE-03, SBR-PERS-04 |
| S2-R8 | SBR-DATE-04 |
| S2-N1 | SBR-STATE-01 |

### Story 3 — Filter by product type
| Bullet | Case(s) |
| --- | --- |
| S3-R1 | SBR-TYPE-01 |
| S3-R2 | SBR-TYPE-01 |
| S3-R3 | SBR-TYPE-01, SBR-PERS-04 |
| S3-R4 | SBR-TYPE-02 |
| S3-R5 | SBR-TYPE-02 |
| S3-R6 | SBR-TYPE-02 |
| S3-R7 | SBR-TYPE-02 |
| S3-R8 | SBR-TYPE-03 |
| S3-N1 | SBR-TYPE-03, SBR-STATE-01 |

### Story 4 — Filter by invoice payment status
| Bullet | Case(s) |
| --- | --- |
| S4-R1 | SBR-STAT-01 |
| S4-R2 | SBR-STAT-01 |
| S4-R3 | SBR-STAT-01, SBR-PERS-04 |
| S4-R4 (five-state → three-value mapping) | SBR-STAT-02 |
| S4-R5 | SBR-STAT-01 |
| S4-R6 | SBR-STAT-03 |
| S4-R7 (filters compose) | SBR-STAT-04 |
| S4-R8 | SBR-STAT-05 |
| S4-N1 | SBR-STAT-03, SBR-STATE-01 |

### Story 5 — View per-rep summary rows
| Bullet | Case(s) |
| --- | --- |
| S5-R1 | SBR-ROW-01 |
| S5-R2 | SBR-ROW-02 |
| S5-R3 | SBR-ROW-02 |
| S5-R4 | SBR-ROW-01 |
| S5-R6 | SBR-ROW-02 |
| S5-R8 | SBR-ROW-02 |
| S5-R9 (Inactive marker + deleted-rep name snapshot) | SBR-ROW-03 |
| S5-R10 | SBR-ROW-04 |
| S5-N1 | SBR-ROW-01 |
| S5-N2 | SBR-ROW-04 |

### Story 6 — Expand a rep to view their invoices
| Bullet | Case(s) |
| --- | --- |
| S6-R1 | SBR-TREE-05, SBR-UNAS-03 |
| S6-R2 (lazy fetch, per-rep pagination) | SBR-TREE-05 (UI), SBR-API-01 (server behavior) |
| S6-R3 | SBR-TREE-05 |
| S6-R4 | SBR-ROW-02 |
| S6-R5 | SBR-TREE-06 |
| S6-R6 | SBR-TREE-06 |
| S6-R7 | SBR-TREE-07 |
| S6-R8 | SBR-TREE-08 |
| S6-R9 (detail-row order) | SBR-TREE-09, SBR-EXP-04 |
| S6-N1 | SBR-TREE-08 |
| S6-N2 | SBR-UNAS-04 |
| S6-E1 | SBR-TREE-05 |

### Story 8 — Invoice payment status badge
| Bullet | Case(s) |
| --- | --- |
| S8-R1 | SBR-BADGE-01 |
| S8-R2 | SBR-BADGE-01 |
| S8-R3 | SBR-BADGE-02 |
| S8-R4 | SBR-BADGE-03 |
| S8-R5 | SBR-BADGE-03 |
| S8-R6 | SBR-BADGE-03 |
| S8-N1 | SBR-BADGE-01 |

### Story 9 — Inv. Hrs (Labor Delta) column display
| Bullet | Case(s) |
| --- | --- |
| S9-R1 | SBR-CALC-01 |
| S9-R2 | SBR-CALC-01 |
| S9-R3 | SBR-CALC-02 |
| S9-R4 | SBR-CALC-02 |
| S9-R5 | SBR-CALC-02 |
| S9-R6 | SBR-CALC-02 |
| S9-N1 | SBR-CALC-03 |
| S9-E1 | SBR-CALC-04 |
| S9-E2 | SBR-CALC-04 |

### Story 10 — Subtotal column and grand Totals indicator
| Bullet | Case(s) |
| --- | --- |
| S10-R1 | SBR-TOT-01 |
| S10-R2 | SBR-TOT-01 |
| S10-R3 | SBR-TOT-01 |
| S10-R4 | SBR-TOT-01 |
| S10-R5 (desktop Totals row / mobile bar / server-computed) | SBR-TOT-02 (desktop), SBR-TOT-03 (mobile), SBR-API-03 (server-computed) |
| S10-R6 | SBR-TOT-04 |
| S10-N1 | SBR-TOT-01, SBR-TOT-02 |

### Story 11 — Sort the report
| Bullet | Case(s) |
| --- | --- |
| S11-R1 | SBR-SORT-01 |
| S11-R2 | SBR-SORT-04 |
| S11-R4 | SBR-SORT-02 |
| S11-R5 (asc/desc, no third state, server-side) | SBR-SORT-03 (UI), SBR-API-02 (server behavior) |
| S11-R6 | SBR-SORT-01 |
| S11-R7 | SBR-SORT-05 |
| S11-N1 | SBR-SORT-06 |

### Story 12 — Navigate to an invoice or customer
| Bullet | Case(s) |
| --- | --- |
| S12-R1 | SBR-LINK-01 |
| S12-R2 | SBR-LINK-01 |
| S12-R3 | SBR-LINK-02 |
| S12-R3a (back restores everything) | SBR-LINK-03 |
| S12-R4 | SBR-LINK-04 |
| S12-R5 | SBR-LINK-04 |
| S12-R6 | SBR-LINK-04 |
| S12-N1 | SBR-LINK-05 |
| S12-N2 | SBR-LINK-05 |
| S12-N3 | SBR-LINK-04 |

### Story 13 — Deactivate a sales rep with customer assignments
| Bullet | Case(s) |
| --- | --- |
| S13-R1 (pre-check) | SBR-DEACT-02 (UI), SBR-API-06 (server behavior) |
| S13-R2 | SBR-DEACT-01 |
| S13-R3 | SBR-DEACT-02 |
| S13-R4 (count headline, pluralization) | SBR-DEACT-02, SBR-API-06 |
| S13-R6 | SBR-DEACT-03 |
| S13-R7 | SBR-DEACT-03 |
| S13-R8 | SBR-DEACT-04 |
| S13-R9 | SBR-DEACT-05 |
| S13-R10 | SBR-DEACT-05 |
| S13-R11 | SBR-DEACT-06, SBR-ASGN-04 |
| S13-R12 (focus trap) | SBR-DEACT-02 |
| S13-N1 | SBR-PERM-03 |
| S13-N2 | SBR-DEACT-07 |
| S13-N3 | SBR-DEACT-07 |
| S13-N4 (check-failed fallback dialog) | SBR-DEACT-09 |
| S13-N5 | SBR-DEACT-08 |
| S13-E1 | SBR-DEACT-05 |
| S13-E3 | SBR-DEACT-07 |

### Story 14 — PDF and CSV exports
| Bullet | Case(s) |
| --- | --- |
| S14-R1 | SBR-EXP-01 |
| S14-R2 | SBR-EXP-02 |
| S14-R2a (currently-active order, server-generated) | SBR-EXP-02, SBR-API-04 |
| S14-R3 (A4, header strip) | SBR-EXP-03, SBR-EXP-04 |
| S14-R3a (default-logo fallback) | SBR-EXP-06 |
| S14-R4 (footer) | SBR-EXP-06 |
| S14-R5 (Summary PDF) | SBR-EXP-03 |
| S14-R6 (Expanded View PDF) | SBR-EXP-04 |
| S14-R7 (18-char truncation) | SBR-EXP-05 |
| S14-R8 (badge in PDF) | SBR-EXP-04 |
| S14-R9 (accounting parentheses) | SBR-EXP-07 |
| S14-R10 ((N) omitted / (Inactive) kept) | SBR-EXP-07 |
| S14-R11 (PDF filenames) | SBR-EXP-06 |
| S14-R12 (font tier table) | SBR-EXP-08 (tiers), SBR-EXP-09 (no-positive → 11px) |
| S14-R13 (fixed column widths) | SBR-EXP-08 |
| S14-R14 (negative one-tier shift, 8px clamp) | SBR-EXP-09 |
| S14-R15 (Summary CSV) | SBR-EXP-10 |
| S14-R16 (Expanded CSV) | SBR-EXP-11 |
| S14-R17 (CSV cell formatting) | SBR-EXP-12 |
| S14-R18 (# Invoices / # Customers) | SBR-EXP-10 |
| S14-R19 (Unassigned row in exports) | SBR-EXP-13 |
| S14-N1 | SBR-EXP-14 |
| S14-N2 (server-side, never malformed) | SBR-EXP-14, SBR-API-04 |
| S14-N3 | SBR-PERM-02 |
| S14-E1 (loading state) | SBR-EXP-14 |
| S14-E2 (10,000-row cap) | SBR-EXP-15, SBR-API-05 |
| S14-E3 (empty-data export) | SBR-EXP-16, SBR-API-04 |

### Story 15 — Sales Rep Assignments CSV export
| Bullet | Case(s) |
| --- | --- |
| S15-R1 | SBR-ASGN-01 |
| S15-R2 | SBR-ASGN-01 |
| S15-R3 | SBR-ASGN-02 |
| S15-R4 | SBR-ASGN-02 |
| S15-R5 | SBR-ASGN-03 |
| S15-R6 | SBR-ASGN-04 |
| S15-R7 | SBR-ASGN-03 |
| S15-R8 | SBR-ASGN-05 |
| S15-R9 (name drift) | SBR-ASGN-05 |
| S15-R10 | SBR-ASGN-03 |
| S15-R11 | SBR-ASGN-06 |
| S15-N1 | SBR-PERM-02 |
| S15-N2 | SBR-ASGN-06 |

### Story 16 — Loading, empty, and error states
| Bullet | Case(s) |
| --- | --- |
| S16-R1 | SBR-STATE-01 |
| S16-R2 | SBR-STATE-01 |
| S16-R3 | SBR-STATE-02 |
| S16-R4 | SBR-STATE-03 (also referenced by SBR-DATE-03, SBR-TOT-02) |
| S16-R5 | SBR-STATE-04 |
| S16-N1 | SBR-STATE-01 |

### Story 17 — Mobile usability
| Bullet | Case(s) |
| --- | --- |
| S17-R1 | SBR-MOB-01 |
| S17-R2 | SBR-MOB-01 |
| S17-R3 | SBR-MOB-01, SBR-EXP-01 (⋯ first in the action cluster) |
| S17-R4 | SBR-MOB-02 (also SBR-TOT-03) |
| S17-R5 | SBR-MOB-02 |
| S17-R6 | SBR-MOB-03 |
| S17-N1 | SBR-MOB-03 |

### Story 18 — Visual conformance and accessibility
| Bullet | Case(s) |
| --- | --- |
| S18-R1 | SBR-VIS-01 |
| S18-R2 | SBR-VIS-01 |
| S18-R3 | SBR-VIS-01 |
| S18-R4 | SBR-VIS-01, SBR-ROW-02 |
| S18-R5 | SBR-VIS-01 |
| S18-R6 | SBR-BADGE-03 |
| S18-R6a | SBR-ROW-04 |
| S18-R7 (container) | SBR-VIS-01 |
| S18-R7.1 | SBR-VIS-01 |
| S18-R7.2 (toolbar control order) | SBR-VIS-01, SBR-LOC-01, SBR-UNAS-01 |
| S18-R7.3 | SBR-VIS-01 |
| S18-R7.4 | SBR-VIS-01 |
| S18-R7.5 | SBR-VIS-01, SBR-TOT-01 |
| S18-R7.6 | SBR-VIS-01 |
| S18-R8 (dark mode) | SBR-VIS-02, SBR-BADGE-02 |
| S18-R9 (accessible names) | SBR-VIS-03 (also SBR-MOB-03) |
| S18-R10 (keyboard + state exposure) | SBR-VIS-04 |
| S18-R11 (contrast) | SBR-VIS-05 |
| S18-R12 (no color-only) | SBR-VIS-05 (also SBR-CALC-02, SBR-BADGE-03, SBR-LINK-04) |
| S18-N1 | SBR-VIS-01 |

### Story 19 — Work Order Sales Rep assignment
| Bullet | Case(s) |
| --- | --- |
| S19-R1 | SBR-WO-01 |
| S19-R2 | SBR-WO-02 |
| S19-R3 | SBR-WO-03 |
| S19-R4 | SBR-WO-03 |
| S19-R5 | SBR-WO-04 |
| S19-R6 (snapshot fallback chain) | SBR-WO-05 |
| S19-R7 (customer record row) | SBR-WO-06 |
| S19-R8 | SBR-WO-02 |
| S19-E1 | SBR-WO-06 |
| S19-N1 | SBR-WO-01 |
| S19-N2 | SBR-WO-05 |

### Story 20 — Column selector
| Bullet | Case(s) |
| --- | --- |
| S20-R1 | SBR-COL-01 |
| S20-R2 | SBR-COL-01 |
| S20-R3 | SBR-COL-02 |
| S20-R4 | SBR-COL-03 |
| S20-R5 | SBR-PERS-01 |
| S20-R6 | SBR-COL-01, SBR-PERS-04 |
| S20-R7 | SBR-COL-03 |
| S20-R8 | SBR-COL-04 |
| S20-R9 | SBR-COL-05 |
| S20-N1 | SBR-COL-06 |

### Story 21 — Filter by location
| Bullet | Case(s) |
| --- | --- |
| S21-R1 | SBR-LOC-01 |
| S21-R2 | SBR-LOC-02, SBR-PERS-04 |
| S21-R3 | SBR-LOC-03 |
| S21-R4 | SBR-LOC-03 |
| S21-R5 | SBR-LOC-03 |
| S21-R6 | SBR-EXP-02 |
| S21-N1 | SBR-LOC-04 |
| S21-N2 | SBR-STATE-01 |

### Story 22 — Show Unassigned invoices
| Bullet | Case(s) |
| --- | --- |
| S22-R1 | SBR-UNAS-01 |
| S22-R2 | SBR-UNAS-01, SBR-EXP-13 |
| S22-R3 | SBR-UNAS-02 |
| S22-R4 | SBR-UNAS-02, SBR-SORT-04, SBR-EXP-02 |
| S22-R5 | SBR-UNAS-03 |
| S22-R6 | SBR-UNAS-02 |
| S22-N1 | SBR-UNAS-04 |

### Story 23 — Remember filters and view
| Bullet | Case(s) |
| --- | --- |
| S23-R1 | SBR-PERS-01 |
| S23-R2 | SBR-PERS-02 (also SBR-TREE-08, SBR-LINK-03) |
| S23-R3 (defensive restore) | SBR-PERS-03 |
| S23-R4 (first-visit defaults) | SBR-PERS-04 |
| S23-R5 (A→Z as a distinct saved value) | SBR-PERS-05, SBR-SORT-03 |
| S23-N1 | SBR-PERS-04 |

### §3 Key Decisions / definitions (calc contract)
| Item | Case(s) |
| --- | --- |
| Grouped per-rep, one rep per invoice | SBR-ROW-01, SBR-TREE-07 |
| Contributors only | SBR-ROW-01 |
| Inactive-but-matching rep shown, credited, "(Inactive)" | SBR-ROW-03 |
| Single sales-rep model / snapshot chain | SBR-WO-05 |
| Standardized money labels + definitions (Subtotal, Labor/Parts Margin, Margin) | SBR-CALC-06 |
| Margin % (1dp, %, "—" when ≤ 0, recomputed on rollups) | SBR-CALC-05 |
| Inv. Hrs definition | SBR-CALC-01 |
| Payment-status five-state → three-value mapping (incl. prepaid balance rule) | SBR-STAT-02, SBR-BADGE-01 |
| Invoice date / invoice location basis | SBR-DATE-04, SBR-LOC-03 |
| Reversed invoices excluded everywhere | SBR-ROW-01 |
| Half-up rounding, rolled-up from unrounded | SBR-CALC-08 |
| Subtotal headline (bold, pinned) | SBR-TOT-01 |
| Accounting parentheses for negatives (screen + PDFs; CSVs plain signed) | SBR-CALC-07 (screen), SBR-EXP-07 (PDFs), SBR-EXP-12 (CSVs) |
| A→Z ordering, Unassigned pinned top | SBR-SORT-02, SBR-UNAS-02 |
| Same-tab links + back restores state | SBR-LINK-01..03 |
| No on-screen search bar | Encoded in SBR-ROW-01's drilldown-via-chevron framing (no dedicated absence case — see Exclusions) |
| Placement additive at bottom of Performance | SBR-NAV-01 |

### §7 User Feedback Summary (verbatim messages)
| Trigger | Message | Case(s) |
| --- | --- | --- |
| Report data fails to load | "Couldn't load the report. Please try again." (inline + Retry) | SBR-STATE-04 |
| Report empty for current filters | "No sales activity matches the current filters." | SBR-STATE-01 |
| Download Summary (PDF) fails | "Ooooops! An error occured" (120s) | SBR-EXP-14 |
| Download Expanded View (PDF) fails | "Ooooops! An error occured" (120s) | SBR-EXP-14 |
| Download Summary/Expanded (CSV) fails | "Ooooops! An error occured" (120s) | SBR-EXP-14 |
| Expanded View PDF exceeds the row cap | "This export is too large to generate. Narrow the date range or filters and try again." (120s) | SBR-EXP-15, SBR-API-05 |
| Assignments CSV export succeeds | "Success" + caption "Report downloaded." (5s) | SBR-ASGN-02 |
| Assignments CSV export fails | "An error occurred while exporting the report. Please try again." (5s) | SBR-ASGN-06 |
| Assignments — nothing to export | "There is no data to export for the selected report." (dialog warning) | SBR-ASGN-06 |
| Deactivation succeeds | (No toast — the staff edit dialog closes.) | SBR-DEACT-05 |
| Deactivation fails (server error) | "Ooooops! An error occured" + request-id caption (120s) | SBR-DEACT-08 |

## Coverage stats (Standing Rule 17)
- **Numbered requirement/negative/edge bullets in the spec:** 230 (Stories 1–23; there
  is deliberately no Story 7 — retired numbering, per the spec's §6 numbering note).
- **Covered:** 230/230 mapped above (100%); all 11 §7 message rows mapped; the §3/§4
  calculation contract mapped; §5 assumptions exercised implicitly (P/S prefixes by
  SBR-TYPE-02; independent staff-active vs toggle flags by SBR-ASGN-04).
- **Processed:** 127 cases across 23 sections; 0 bullets unmapped.
- **Excluded-with-reason:** see below.

## Exclusions (with reasons)
- **Story 7** — does not exist (retired number; the spec's numbering note says gaps are
  deliberate, not dropped content). No case authored.
- **S5-R5 / S5-R7 / S11-R3 / S13-R5 / S13-E2 (unused numbers within stories)** — the
  spec skips these numbers (stable-numbering rule; gaps deliberate); nothing to cover.
- **"No on-screen search bar" (§3)** — a pure-absence assertion with no specified UI to
  observe; not authored as its own case (absence of an unspecified control cannot be
  asserted without inventing labels). The chevron-drilldown model it mandates is covered.
- **§2 Out of Scope items** — per-line-item rep splits, bulk reassignment tool,
  mobile-optimized redesign, aging/"days since" logic, expanded-set/scroll persistence
  (its in-scope halves ARE covered: SBR-PERS-02, SBR-LINK-03), historical backfill,
  third-party feed / QuickBooks sync — not authored, out of scope by spec.
- **§8 Change Log entries** — process history, not testable requirements; their
  behavioral outcomes are covered by the current-requirement cases.

## VIU-confirm register (unpinned by the spec — confirm live, never invent)
1. Which report currently sits last in the Performance group (the anchor for "bottom of
   the group", S1-R2) — SBR-NAV-01.
2. Exact preset names/order rendering in the date picker and the 366-day-cap enforcement
   UI (blocked selection vs error) — SBR-DATE-01/02.
3. Exact capitalisation of "All Locations" and the location multi-select layout — SBR-LOC-01.
4. Chevron glyphs (expand/collapse) and the header-chevron placement — SBR-TREE-05/06.
5. The application's canonical payment-status color tokens (exact teal/orange/red values)
   — SBR-BADGE-02.
6. Theme-primary link color value and focus-indicator styling — SBR-LINK-04.
7. Staff-administration surface for the active toggle + sales-rep toggle (screen/labels)
   — SBR-DEACT-01..09, SBR-ASGN-04, SBR-WO-02.
8. The Export Reports dialog's current Report Name list (to confirm "appended at the
   bottom") — SBR-ASGN-01.
9. Appearance of the "standard reports loading indicator" — SBR-STATE-03.
10. Whether an >18-character invoice number is seedable — SBR-EXP-05.
11. Whether a >10,000-detail-row filter set is seedable — SBR-EXP-15, SBR-API-05.
12. PDF body font pixel sizes (needs a PDF inspector) — SBR-EXP-08/09.
13. All server behaviors: real request shapes for lazy drill-down, sort, grand totals,
    export generation/cap, deactivation pre-check (SBR-API-01..06 — no endpoints invented).
14. Imported-WO and History-mode surfaces for the Sales Rep selector — SBR-WO-01.
15. Dark-mode toggle availability in the environment — SBR-VIS-02.
16. Which invalid-saved-value classes are provocable without a build change — SBR-PERS-03.
17. Epic/Jira key NOT AVAILABLE — ask the user at VIU (do not invent).

## Known-delta register (spec ahead of build BY DESIGN — expect deviations at VIU, author-to-spec)
- **Single sales-rep model** (§3 build note + 2026-07-11 change log): the shipped
  database stores separate parts-side and service-side reps; the spec locks ONE rep per
  customer/WO/invoice with the WO→customer→Unassigned snapshot chain — SBR-WO-05,
  SBR-ASGN-03.
- **Contributors-only + plain A→Z** (2026-07-11 change log): the current handler seeds
  ALL toggle reps and uses tiered active/inactive sort; the spec requires
  contributors-only rows and untired A→Z — SBR-ROW-01, SBR-SORT-02.
- **Server-side model** (2026-07-16 change log): lazy per-rep drill-down, server-side
  sort, server-computed grand totals, all four exports server-generated against
  filters + sort — SBR-API-01..04, SBR-EXP-02, SBR-TREE-05, SBR-SORT-03, SBR-TOT-02.
- **Expanded CSV hours columns** (S14-R16 build note): current build populates a single
  mislabeled hours column; spec target is Hrs Worked / Hrs Invoiced / Inv. Hrs —
  SBR-EXP-11.
- **Five-state payment mapping incl. prepaid balance rule** (2026-07-21 change log) —
  SBR-STAT-02, SBR-BADGE-01.
- **10,000-row Expanded PDF cap + verbatim refusal message** (2026-07-21 change log) —
  SBR-EXP-15, SBR-API-05.
- **Nav-entry padding fix for the full "Sales By Representative" label** (§1 naming
  note: the longer label currently renders with tight padding) — SBR-NAV-03.

## Known-limitation encodings (expected behavior — do NOT file as defects)
- **"Ooooops! An error occured"** — the typo is as-shipped, canonical fallback wording;
  do not file or "correct" it — SBR-EXP-14, SBR-DEACT-08.
- **Totals may differ from eye-summed rows by one unit in the last decimal** (rolled-up
  from unrounded components, §3) — SBR-CALC-08.
- **Expansion state and scroll reset on a deliberate reload** (persistence covers
  filters/columns/sort only; browser-back is the exception) — SBR-PERS-02, SBR-LINK-03.
- **A large (but under-cap) Expanded View PDF is expected, not a defect** — SBR-EXP-15.

## Completeness statement (Standing Rule 17)
- In scope: every numbered requirement/negative/edge bullet of Stories 1–23 (230), the
  §3 definitions/key decisions, §4 terminology contract, §5 assumptions, and all 11 §7
  message rows = ALL mapped above.
- Processed: 127 cases (80 rescued A–C + 47 gap-closing D), 23 sections; 0 bullets unmapped.
- Excluded-with-reason: 5 items (listed above).

## ADDENDUM 2026-07-28 — video-promotion (user ruling: video overrides spec)
- **SBR-LOC-04 C30216 FLIPPED** (video P33): single-location user now expects NO Location
  filter — S21-N1 is overridden, its coverage row now reads through the flipped case.
- **SBR-LOC-03 C30215** now also covers the All-Locations per-row location identifier (video P10).
- Detail: reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md; watch:
  ../SPEC-WATCH-2026-07-28.md (deadline 2026-08-04).

## Addendum 2026-07-29 — Chris Ward group-message deltas (LOCAL only, awaiting push)
Source: `chris-update-2026-07-29/chris-message-2026-07-29.md` (newest, last-update-wins). All-reports:
"Locations:" line in every CSV+PDF export + on-screen location-scope indicator (covered by extending
this report's existing export + location-scoping cases — no new cases needed) + same logo treatment
(only PV lacked coverage → PV-EXP-05 extended). Per-report deltas mapped in
`chris-update-2026-07-29/ChangeList-2026-07-29.md`: SBC = VIN→Unit #→plate identifier (SBC-LBL-01/04)
+ Summary/Expanded exports, four menu items (SBC-EXP-01/03/09/11/16); PV = "Special Order" rename
confirmed (PV-FILT-01/09, PV-ROW-05, PV-EXP-08); TU = NEW column-selector case TU-COL-01 (= C38859, pushed
2026-07-29); WIP = identifier flipped to the VIN chain per Chris's answer A 2026-07-29 ("A is the correct
answer" — wip-identifier-answer-2026-07-29.md; WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03
C30485 + WIP-EXP-07 C30516 caveat; the VIN → Unit # → plate chain is now the STANDARD for all
reports going forward, with the non-vehicle VIN-vs-serial terminology tester note); SBR/IV = the
all-reports items only. Spec changelog expected ~2026-07-30 — re-verify then (Chris's spec edit is
NOT hand-reviewed; confirm the WIP identifier text too).
