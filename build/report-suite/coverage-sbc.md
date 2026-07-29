# SBC (Sales By Customer) — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **82 active SBC cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: SBC-NAV-02 → SBC-NAV-01; SBC-DATE-02 → SBC-PERS-05; SBC-LOC-02 → SBC-PERS-05; SBC-TYPE-01 → SBC-TYPE-02; SBC-TYPE-03 → SBC-TYPE-02; SBC-CUST-08 → SBC-CUST-04; SBC-CUST-07 → SBC-CUST-03; SBC-TREE-07 → SBC-TREE-03; SBC-LBL-02 → SBC-LBL-01; SBC-LBL-03 → SBC-LBL-01; SBC-SORT-05 → SBC-SORT-01; SBC-SORT-06 → SBC-TREE-09; SBC-COL-03 → SBC-COL-02; SBC-EXP-07 → SBC-EXP-02; SBC-EXP-12 → SBC-EXP-06; SBC-EMPTY-03 → SBC-EMPTY-01.
> Cut (retired, body kept locally): SBC-SORT-07 (no-op sort assertion); SBC-EXP-13 (Print removed from SBC (video P25)).
> Added 2026-07-28: SBC-EXP-16 = C38856 (compressed/summary download, video P21).


> Report Suite project — SBC report. Authored 2026-07-22 from
> `specs/sbc-sales-by-customer.md` (spec revision `_2`, change log through 2026-07-21).
> SPEC-ONLY authoring (no designs yet). **99 cases / 18 sections**, all `viu_status: VIU-Pending`.
> Case source: `cases/cases-sbc-A-access-filters.json` (25),
> `cases/cases-sbc-B-tree-links-sorting.json` (28),
> `cases/cases-sbc-C-calcs-columns-exports-persistence.json` (32),
> `cases/cases-sbc-D-states-visual-mobile-api.json` (14).

## Section breakdown

| Section (TestRail leaf under "Report Suite") | Cases |
| --- | --- |
| SBC — Access & Navigation | SBC-NAV-01..02 (2) |
| SBC — Permissions | SBC-PERM-01..04 (4) |
| SBC — Date Range Filter | SBC-DATE-01..04 (4) |
| SBC — Product Type Filter | SBC-TYPE-01..03 (3) |
| SBC — Location Filter | SBC-LOC-01..03 (3) |
| SBC — Customer Filter | SBC-CUST-01..09 (9) |
| SBC — Tree & Rows | SBC-TREE-01..13 (13) |
| SBC — Asset Labels | SBC-LBL-01..04 (4) |
| SBC — Invoice Links & Navigation | SBC-LINK-01..04 (4) |
| SBC — Sorting | SBC-SORT-01..07 (7) |
| SBC — Totals & Calculations | SBC-CALC-01..07 (7) |
| SBC — Column Selector | SBC-COL-01..03 (3) |
| SBC — Exports | SBC-EXP-01..16 (16) |
| SBC — Saved View & Persistence | SBC-PERS-01..07 (7) |
| SBC — Empty & Edge States | SBC-EMPTY-01..04 (4) |
| SBC — Visual Conformance | SBC-VIS-01..03 (3) |
| SBC — Mobile | SBC-MOB-01..02 (2) |
| SBC — API | SBC-API-01..05 (5) — Standing Rule 4 (backend-behavior cases, generically worded, no invented endpoints) |
| **Total** | **99** |

## Requirement → case map (every bullet)

### Story 1 — Report access and navigation placement
| Bullet | Case(s) |
| --- | --- |
| S1-R1 | SBC-NAV-01 |
| S1-R2 | SBC-PERM-01 (positive), SBC-PERM-02 (negative side) |
| S1-R3 | SBC-NAV-02 |
| S1-R4 | SBC-NAV-02 |
| S1-N1 | SBC-PERM-02 |

### Story 2 — Filter by date range
| Bullet | Case(s) |
| --- | --- |
| S2-R1 | SBC-DATE-01 |
| S2-R2 | SBC-DATE-01 |
| S2-R3 | SBC-DATE-03 |
| S2-R4 | SBC-DATE-03 |
| S2-R5 | SBC-DATE-02, SBC-PERS-05 |
| S2-R6 | SBC-DATE-04 |
| S2-R7 | SBC-EXP-05 |
| S2-R8 | SBC-PERS-01 |
| S2-R9 | SBC-PERS-06 (referenced in SBC-DATE-04 note) |
| S2-N1 | SBC-EMPTY-01 |
| S2-N2 | SBC-DATE-03 |

### Story 3 — Filter by product type
| Bullet | Case(s) |
| --- | --- |
| S3-R1 | SBC-TYPE-01 |
| S3-R2 | SBC-TYPE-01 |
| S3-R3 | SBC-TYPE-01, SBC-PERS-05 |
| S3-R4 | SBC-TYPE-03 |
| S3-R5 | SBC-TYPE-02 |
| S3-R6 | SBC-TYPE-02 |
| S3-R7 | SBC-EXP-05 |
| S3-R8 | SBC-PERS-01 |
| S3-N1 | SBC-EMPTY-01 |

### Story 4 — Filter by location
| Bullet | Case(s) |
| --- | --- |
| S4-R1 | SBC-LOC-01 |
| S4-R2 | SBC-LOC-01 |
| S4-R3 | SBC-LOC-01 |
| S4-R4 | SBC-LOC-02, SBC-PERS-05 |
| S4-R5 | SBC-LOC-03 |
| S4-R6 | SBC-LOC-03 |
| S4-R7 | SBC-PERM-04 |
| S4-R8 | SBC-PERM-04 |
| S4-R9 | SBC-PERM-04 |
| S4-R10 | SBC-EXP-05 |
| S4-R11 | SBC-PERS-01 |
| S4-N1 | SBC-PERM-04 |
| S4-N2 | SBC-EMPTY-01 |

### Story 5 — (removed)
Excluded: retired placeholder story — the global-search narrowing moved into Story 18
(S18-R7 → SBC-EXP-05; S18-R10 → SBC-EXP-15). No case needed; nothing to test.

### Story 6 — Remember filters and view between visits
| Bullet | Case(s) |
| --- | --- |
| S6-R1 | SBC-PERS-01 |
| S6-R2 | SBC-PERS-01 |
| S6-R3 | SBC-PERS-02 |
| S6-R4 | SBC-PERS-01 |
| S6-R5 | SBC-PERS-03 |
| S6-R6 | SBC-PERS-03 |
| S6-R7 | SBC-PERS-04 |
| S6-N1 | SBC-PERS-05 |

### Story 7 — View customer summary rows
| Bullet | Case(s) |
| --- | --- |
| S7-R1 | SBC-TREE-01 |
| S7-R2 | SBC-TREE-01 |
| S7-R3 | SBC-TREE-01 |
| S7-R4 | SBC-TREE-01 |
| S7-R5 | SBC-TREE-01 |
| S7-R6 | SBC-CALC-01 (column set/composition), SBC-CALC-05 (summary-row roll-up sums exactly, every financial column), SBC-TREE-01 |
| S7-R7 | SBC-TREE-12 |
| S7-R8 | SBC-TREE-13 |
| S7-R9 | SBC-TREE-13 |
| S7-R10 | SBC-TREE-13 |
| S7-R11 | SBC-CALC-02 |
| S7-R12 | SBC-CALC-02 |
| S7-R13 | SBC-CALC-02 |
| S7-R14 | SBC-CALC-02 |
| S7-R15 | SBC-TREE-13 |
| S7-R16 | SBC-TREE-13 |
| S7-N1 | SBC-TREE-02 |
| S7-N2 | SBC-TREE-12 |

### Story 8 — Expand customer → assets → invoices
| Bullet | Case(s) |
| --- | --- |
| S8-R1 | SBC-TREE-03 |
| S8-R2 | SBC-TREE-03 |
| S8-R3 | SBC-TREE-05 |
| S8-R4 | SBC-TREE-04 |
| S8-R5 | SBC-TREE-03 |
| S8-R5a | SBC-TREE-03 |
| S8-R5b | SBC-TREE-03 |
| S8-R5c | SBC-TREE-03 |
| S8-R6 | SBC-TREE-06 |
| S8-R6a | SBC-TREE-06 |
| S8-R7 | SBC-LBL-01 |
| S8-R8 | SBC-LBL-01 |
| S8-R9 | SBC-LBL-02 |
| S8-R10 | SBC-LBL-03 |
| S8-R11 | SBC-LBL-04 |
| S8-R12 | SBC-TREE-04 |
| S8-R12a | SBC-TREE-04 |
| S8-R13 | SBC-CALC-05 |
| S8-R14 | SBC-API-01 |
| S8-R15 | SBC-TREE-07 |
| S8-R16 | SBC-TREE-08, SBC-API-01 (bounded fetches) |
| S8-R17 | SBC-TREE-08 |
| S8-R18 | SBC-TREE-08 |
| S8-R19 | SBC-TREE-08 |
| S8-R20 | SBC-TREE-09 |
| S8-R21 | SBC-TREE-09 |
| S8-R22 | SBC-PERS-02 |
| S8-N1 | SBC-EMPTY-01 |
| S8-E1 | SBC-TREE-10 |
| S8-E2 | SBC-TREE-10 |
| S8-E3 | SBC-TREE-11 |

### Story 9 — Open an invoice
| Bullet | Case(s) |
| --- | --- |
| S9-R1 | SBC-LINK-01 |
| S9-R2 | SBC-LINK-01 |
| S9-R2a | SBC-LINK-01 |
| S9-R2b | SBC-LINK-01 |
| S9-R3 | SBC-LINK-02 |
| S9-R4 | SBC-LINK-02 |
| S9-R5 | SBC-LINK-03 |
| S9-R6 | SBC-LINK-03 |
| S9-R7 | SBC-LINK-03 |
| S9-R8 | SBC-LINK-03 |
| S9-N1 | SBC-LINK-04 |
| S9-N2 | SBC-PERM-03 |

### Story 10 — Sort the report
| Bullet | Case(s) |
| --- | --- |
| S10-R1 | SBC-SORT-01 |
| S10-R2 | SBC-SORT-01 |
| S10-R3 | SBC-SORT-03 |
| S10-R4 | SBC-SORT-02 |
| S10-R5 | SBC-SORT-04 |
| S10-R6 | SBC-SORT-05, SBC-TREE-06 |
| S10-R7 | SBC-SORT-02 |
| S10-R8 | SBC-API-02 |
| S10-R8a | SBC-SORT-06 |
| S10-R8b | SBC-SORT-06, SBC-API-02 |
| S10-R8c | SBC-SORT-06 |
| S10-R9 | SBC-PERS-01 |
| S10-N1 | SBC-SORT-07 |

### Story 11 — Subtotal column behavior
| Bullet | Case(s) |
| --- | --- |
| S11-R1 | SBC-CALC-06, SBC-CALC-01 |
| S11-R2 | SBC-CALC-06 |
| S11-R3 | SBC-CALC-06 |
| S11-N1 | SBC-CALC-06 (spec declares no applicable negative — encoded as the unconditional expectation in that case) |

### Story 12 — Inv. Hrs (Labor Delta) display
| Bullet | Case(s) |
| --- | --- |
| S12-R1..R6 | SBC-CALC-03 |
| S12-N1 | SBC-CALC-04 |
| S12-E1 | SBC-CALC-04 |
| S12-E2 | SBC-CALC-04 |

### Story 13 — Show or hide columns
| Bullet | Case(s) |
| --- | --- |
| S13-R1 | SBC-COL-01 |
| S13-R2 | SBC-COL-01 |
| S13-R3 | SBC-COL-01 |
| S13-R4 | SBC-COL-01 |
| S13-R5 | SBC-COL-02 |
| S13-R6 | SBC-COL-02 |
| S13-R7 | SBC-COL-01 |
| S13-R8 | SBC-PERS-01 |
| S13-N1 | SBC-COL-03 |

### Story 14 — Export as CSV
| Bullet | Case(s) |
| --- | --- |
| S14-R1 | SBC-EXP-01 |
| S14-R2 | SBC-EXP-01 |
| S14-R3 | SBC-EXP-05, SBC-API-05 |
| S14-R4 | SBC-EXP-02 |
| S14-R5 | SBC-EXP-02 |
| S14-R6 | SBC-EXP-03 |
| S14-R7 | SBC-EXP-03 |
| S14-R8 | SBC-EXP-03 |
| S14-R9 | SBC-EXP-03 |
| S14-R10 | SBC-EXP-04 (format), SBC-EXP-03 (flat layout context) |
| S14-R11 | SBC-EXP-04 |
| S14-R12 | SBC-EXP-04 |
| S14-R13 | SBC-EXP-04 |
| S14-R14 | SBC-EXP-14, SBC-API-05 |
| S14-N1 | SBC-EXP-06 |
| S14-E1 | SBC-EXP-06 |

### Story 15 — Download as PDF
| Bullet | Case(s) |
| --- | --- |
| S15-R1 | SBC-EXP-01 |
| S15-R2 | SBC-EXP-01 |
| S15-R3 | SBC-EXP-05, SBC-API-05 |
| S15-R4 | SBC-EXP-07 |
| S15-R5 | SBC-EXP-08 |
| S15-R6 | SBC-EXP-08 |
| S15-R7 | SBC-EXP-09 |
| S15-R8 | SBC-EXP-09 |
| S15-R9 | SBC-EXP-09 |
| S15-R10 | SBC-EXP-09 |
| S15-R11 | SBC-EXP-09 |
| S15-R12 | SBC-EXP-10 |
| S15-R13 | SBC-EXP-10 |
| S15-R14 | SBC-EXP-10 |
| S15-R15 | SBC-EXP-10 |
| S15-R16 | SBC-EXP-11 |
| S15-R17 | SBC-EXP-11 |
| S15-R18 | SBC-EXP-11 |
| S15-R19 | SBC-EXP-11 |
| S15-R20 | SBC-EXP-11 |
| S15-R21 | SBC-EXP-11 |
| S15-R22 | SBC-EXP-14, SBC-API-05 |
| S15-N1 | SBC-EXP-12 |
| S15-E1 | SBC-EXP-12 |

### Story 16 — Print the report
| Bullet | Case(s) |
| --- | --- |
| S16-R1 | SBC-EXP-01 |
| S16-R2 | SBC-EXP-01 |
| S16-R3 / R3a / R3b / R3c | SBC-EXP-13 |
| S16-R4 | SBC-EXP-13 |
| S16-R5 | SBC-EXP-13 |
| S16-R6 | SBC-EXP-14 |
| S16-N1 | SBC-EXP-13 |

### Story 17 — Empty state
| Bullet | Case(s) |
| --- | --- |
| S17-R1 | SBC-EMPTY-01 |
| S17-R2 | SBC-EMPTY-01 |
| S17-R3 | SBC-EMPTY-01 |
| S17-N1 | SBC-EMPTY-02 |
| S17-E1 | SBC-EMPTY-03, SBC-CUST-07 |

### Story 18 — Filter by customer
| Bullet | Case(s) |
| --- | --- |
| S18-R1 | SBC-CUST-01 |
| S18-R2 | SBC-CUST-01, SBC-CUST-02, SBC-API-03 |
| S18-R3 | SBC-CUST-03 |
| S18-R4 | SBC-CUST-04, SBC-CUST-08, SBC-API-03 |
| S18-R5 | SBC-CUST-04, SBC-CUST-05, SBC-CUST-06 |
| S18-R6 | SBC-CALC-07, SBC-API-04 |
| S18-R7 | SBC-EXP-05 |
| S18-R8 | SBC-PERS-07, SBC-PERS-01 |
| S18-R9 | SBC-CUST-08, SBC-CUST-09 |
| S18-R10 | SBC-EXP-15 |
| S18-R11 | SBC-CUST-06, SBC-API-04 |
| S18-N1 | SBC-CUST-07 |
| S18-E1 | SBC-CUST-08, SBC-CUST-09, SBC-EMPTY-03 |

### Story 19 — (removed)
Excluded: retired placeholder — side-by-side asset comparison deferred to a future
dedicated report (§2 Out of Scope + §3 Key Decision). No case authored.

### Story 20 — Visual conformance
| Bullet | Case(s) |
| --- | --- |
| S20-R1..R7 | SBC-VIS-01 |
| S20-R8..R11 | SBC-VIS-02 |
| S20-R12 / R13 | SBC-VIS-01 |
| S20-R14 | SBC-VIS-02, SBC-TREE-04 |
| S20-R15 | SBC-VIS-01 |
| S20-R16 | SBC-EXP-01 |
| S20-R17 | SBC-VIS-01 |
| S20-R18 | SBC-VIS-03 |
| S20-N1 | Excluded — spec declares "no applicable user-visible negative cases"; the rules are asserted unconditionally in SBC-VIS-01..03 |

### Story 21 — Mobile usability
| Bullet | Case(s) |
| --- | --- |
| S21-R1 | SBC-MOB-01 |
| S21-R2 | SBC-MOB-01 |
| S21-R3 | SBC-MOB-01 |
| S21-R4 | SBC-MOB-02 |
| S21-R5 | SBC-MOB-02 |
| S21-R6 | SBC-MOB-02 |

### §7 User Feedback Summary (verbatim messages)
| Trigger | Message | Case(s) |
| --- | --- | --- |
| No results | "No sales data found for the selected filters." | SBC-EMPTY-01, SBC-CUST-07 |
| Initial fetch fails | "An error occurred while fetching the report data." (5s auto-fade) | SBC-EMPTY-04 |
| CSV export fails | "CSV export failed." | SBC-EXP-06 |
| PDF download fails | "PDF export failed." | SBC-EXP-12 |
| Print PDF fails | "PDF generation failed." | SBC-EXP-13 |
| Export exceeds 10,000-row cap | "This export is too large to generate. Narrow the date range or filters, then try again." | SBC-EXP-14, SBC-API-05 |
| CSV/PDF/Print starts (no toast, loading state) | — | SBC-EXP-06 / SBC-EXP-12 / SBC-EXP-13 |

## Coverage stats
- **Requirement/negative/edge bullets in spec:** 235 numbered bullets (Stories 1–21
  excl. the two retired placeholder stories; independently recounted 2026-07-22 —
  every `S#-R/N/E` line incl. lettered sub-bullets like S8-R5a/S10-R8c) + 9 §7
  message rows + §4/§3 calc contract.
- **Covered:** 235/235 numbered bullets accounted for above (100%): 234 mapped to
  cases (S11-N1 encoded as the unconditional expectation inside SBC-CALC-06);
  S20-N1 is the sole encoded-exclusion (spec-declared "no applicable negative",
  asserted unconditionally in SBC-VIS-01..03). All §7 messages mapped;
  §4 Subtotal/Shop Supplies/Margin/Margin %/Labor Delta contract covered by
  SBC-CALC-01..04; §5 assumptions exercised implicitly by SBC-TYPE-02 (prefixes).
- **Exclusions (with reasons):** Story 5 (retired placeholder — behavior re-homed to
  Story 18); Story 19 (retired placeholder — asset comparison deferred); S11-N1 and
  S20-N1 (spec-declared "no applicable negative" — encoded as unconditional
  expectations, not separate cases); §2 Out of Scope items (QuickBooks sync,
  per-line-item classification, separate parts-only report, mobile redesign,
  aging/days-since logic, invoice editing from the report, bulk actions, side-by-side
  asset comparison) — not authored, out of scope by spec.

## VIU-confirm register (unpinned by spec — confirm live, never invent)
1. Navigation placement/group of the "Sales By Customer" entry (SBC-NAV-01).
2. Exact name/location of the dedicated View permission in the role editor (SBC-PERM-01).
3. Blocked-state behavior on direct link without permission (SBC-PERM-02).
4. Exact capitalisation of "All locations" (SBC-LOC-01).
5. Mechanism/wording preventing a >366-day Custom range (SBC-DATE-03).
6. Vehicle icon glyph on asset rows (SBC-TREE-03).
7. Rendered punctuation of the asset-label separator " · " and "VIN …" prefix (SBC-LBL-01).
8. Count color #616161 / weights 600/700 via dev tools (SBC-TREE-01, SBC-TREE-13, SBC-CALC-06).
9. Whether a fully-blank asset ("Unknown Asset") is seedable via the asset form (SBC-LBL-03).
10. Whether the no-logo-at-all PDF state is reachable (SBC-EXP-10).
11. All server behaviors: real request shapes for lazy drill-down, sort, type-ahead,
    pagination/totals, export generation/cap (SBC-API-01..05 — no endpoints invented).
12. Which invalid-saved-value classes are provocable without a build change (SBC-PERS-03).

## Known build-deltas (spec ahead of code by design — expect deviations at VIU, author-to-spec)
- 2026-07-16 round: server-side model (server pagination, server sort, lazy drill-down,
  server-computed totals, server-generated exports, All-Time removal, 366-day cap) —
  flagged in SBC-SORT-06, SBC-CALC-07, SBC-EXP-14, SBC-API-01/02/04/05, SBC-DATE-01.
- 2026-07-21 round: server-backed type-ahead Customer filter, explicit all-customers
  state, "N selected" label, 10,000-row export cap — flagged in SBC-CUST-02/04/08,
  SBC-PERS-07, SBC-EXP-14, SBC-API-03/05.

## Known-limitation encodings (expected behavior — do NOT file as defects)
- Expansion collapsed after browser-back (S9-R4) — SBC-LINK-02.
- Saved view beats a shared link's range (S2-R9) — SBC-PERS-06.
- PDF header "Mon D, YYYY" vs body "Mon DD YYYY" is intentional (S15-R9) — SBC-EXP-09.
- CSV/PDF are flat with no asset layer (S14-R10 context) — SBC-EXP-03.
- Margin excludes Shop Supplies while Subtotal includes them (§4) — SBC-CALC-01.
- Whole-invoice S/P classification by prefix, no per-line split (§2/§3) — SBC-TYPE-02.
- Expansion/search-text/scroll not persisted (S6-R3) — SBC-PERS-02.

## ADDENDUM 2026-07-28 — video-promotion (user ruling: video overrides spec)
- **NEW: SBC-EXP-16** (no C-ID yet) — compressed (summary) download option, kickoff video P21
  (no spec requirement exists yet; refs = epic SV-8582, stated explicitly).
- **RETIRE-PROPOSED: SBC-EXP-13 C30171** (Print behavior) — video P25 removes Print; Story 16
  (S16-R1..R6) coverage is retire-proposed, NOT deleted. SBC-EXP-01/SBC-EXP-14 edited to
  expect NO Print.
- **SBC-LBL-01** now covers the serial-number identifier (video P24; S8-R8 overridden);
  **SBC-LOC-03** now also covers the All-locations per-row location identifier (video P10).
- Full detail: reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md; watch:
  ../SPEC-WATCH-2026-07-28.md (deadline 2026-08-04); backups:
  ../video-promotion-backup-2026-07-28/.

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
