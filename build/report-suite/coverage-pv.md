# Parts Velocity (PV) — Coverage Matrix

> **CONSOLIDATION UPDATE 2026-07-28 (user-authorized, pushed to TestRail):** the suite was
> consolidated to **67 active PV cases**. Every case ID below still resolves:
> a merged-away ID's coverage now lives in its SURVIVOR (mapping below); cut cases' assertions
> were either duplicates of a survivor or dropped by the usefulness/sense audit. Detail:
> `consolidation-backup-2026-07-28/MANIFEST.md` + `quality-audit-2026-07-28/MERGE-PLAN.md`.
>
> Merged-away → survivor: PV-FILT-02 → PV-FILT-01; PV-EXP-09 → PV-EXP-10.
> Cut (retired, body kept locally): PV-COL-07 (stale-schema seeding not manual-testable).


> Report Suite project — per-report coverage doc. Spec source:
> `build/report-suite/specs/parts-velocity.md` (revision `_1`, ingested 2026-07-22;
> latest change-log entry 2026-07-16 — server-side data model per Milan's review).
> Cases: `build/report-suite/cases/cases-pv-*.json` — **70 cases / 9 sections**,
> all `viu_status: VIU-Pending` (SPEC-ONLY authoring; no designs yet).
> LOCAL ONLY — nothing pushed to TestRail.

## Case inventory (70)

| Section (TestRail subsection under "Report Suite") | IDs | Count |
| --- | --- | --- |
| PV — Access & Defaults | PV-NAV-01..03 | 3 |
| PV — Permissions | PV-PERM-01..03 | 3 |
| PV — Filters | PV-FILT-01..13 | 13 |
| PV — Row Model | PV-ROW-01..10 | 10 |
| PV — Columns & Remembered View | PV-COL-01..08 | 8 |
| PV — Columns & Calculations | PV-CALC-01..16 | 16 |
| PV — Exports | PV-EXP-01..10 | 10 |
| PV — Visual Conformance | PV-VIS-01..03 | 3 |
| PV — API (Standing Rule 4; generic wording, no invented endpoints) | PV-API-01..04 | 4 |

Count note (Standing Rule 17): the onboarding estimate was ~45–60; the authored
count is 70 because the spec's authoritative 20-column calc/format/null tables
(Story 5), the per-location/merged row model, and the remembered-view model each
required dedicated encoding — every case below maps to explicit spec bullets.

## Requirement → case map

### §2 Feature Overview / §3 Key Decisions
| Requirement | Case(s) |
| --- | --- |
| Reports → Parts section (new) + report entry | PV-NAV-01 |
| Inventory vs Catalogue types; Type filter | PV-FILT-01, PV-FILT-02 |
| Default Demand-descending ranking | PV-ROW-03 |
| Movement + profitability + stocking metrics per row | PV-CALC-01..10 |
| Catalogue `—` for inventory-only metrics | PV-ROW-02, PV-ROW-08 |
| Column picker + remembered view precedence | PV-COL-01..08 |
| CSV/PDF exports reflect filters/columns/sort | PV-EXP-02..04 |
| Two-tone layout | PV-VIS-01 |
| Server-paginated at scale (50–60k parts) | PV-API-01 |
| Out of scope: Min/Max read-only (no edit) | PV-CALC-08 |
| Out of scope: no A/B/C/D groups, no PO creation, no real-time sync | Excluded — out of scope by spec §2 (no cases; would be testing absence of unspecified UI) |
| Out of scope: no "All Time" range | PV-FILT-03 |
| Demand as ranking metric (key decision) | PV-ROW-03, PV-CALC-06 |
| Profitability from billed lines, netting reversals | PV-CALC-10, PV-CALC-11 |
| Catalogue rows from vendor-sourced requests | PV-CALC-02 |
| Inventory rows per location / catalogue merged | PV-ROW-01, PV-ROW-02 |
| Units Returned from return records net of cancellations | PV-CALC-03 |
| Core parts excluded | PV-CALC-14 |
| Keep-row rule (activity or stock or revenue) | PV-ROW-09 |
| 14 default-visible columns | PV-COL-02 |
| Search Part # + Description only | PV-FILT-06 |
| View remembered per browser | PV-COL-04, PV-COL-06 |
| Export matches current filters/sort; export-only alignment | PV-EXP-02, PV-EXP-04, PV-EXP-08 |

### Story 1 — Report Access & Location
| Req | Case(s) |
| --- | --- |
| S1-R1 | PV-NAV-01 |
| S1-R2 | PV-NAV-02 (return-visit half also PV-COL-04) |
| S1-R3 | PV-NAV-03 |
| S1-R4 | PV-PERM-01 (positive), PV-PERM-03 (denied), PV-API-04 (backend) |
| S1-N1 | PV-PERM-02 |
| S1-N2 | PV-PERM-03 |

### Story 2 — Filters & Search
| Req | Case(s) |
| --- | --- |
| S2-R1 | PV-FILT-01, PV-FILT-02 |
| S2-R2 | PV-FILT-03 |
| S2-R3 | PV-FILT-04 |
| S2-R4 | PV-FILT-05 |
| S2-R5 | PV-FILT-05 |
| S2-R6 | PV-FILT-06 |
| S2-R7 | PV-FILT-07 |
| S2-R8 | PV-FILT-08, PV-FILT-09 |
| S2-R9 | PV-FILT-10 (single-location edge PV-FILT-13) |
| S2-R10 | PV-API-02 (+ per-filter reload assertions inside PV-FILT-02/05/08/10) |
| S2-R11 | PV-FILT-11 |
| S2-N1 | PV-FILT-11 |
| S2-E1 / S2-E2 / S2-E3 | PV-FILT-12 |
| S2-E4 | PV-FILT-13 |

### Story 3 — Data Table
| Req | Case(s) |
| --- | --- |
| S3-R1 | Covered implicitly by PV-COL-02/03 (rows show enabled columns) + PV-ROW-01/02 (one row per part) |
| S3-R1a | PV-ROW-01 (inventory), PV-ROW-02 (catalogue) |
| S3-R2 | PV-ROW-03 |
| S3-R3 | PV-ROW-04 (UI), PV-API-03 (server semantics) |
| S3-R4 | PV-ROW-05 |
| S3-R5 | PV-ROW-05 (+ PV-FILT-02) |
| S3-R6 | PV-ROW-06 (icons + verbatim tooltip table) |
| S3-R7 | PV-ROW-07 |
| S3-R8 | PV-ROW-05 (export side PV-EXP-08) |
| S3-R9 | PV-ROW-08 (full formatting PV-CALC-13) |
| S3-N1 | PV-ROW-09 |
| S3-E1 | PV-ROW-10 |

### Story 4 — Columns & Remembered View
| Req | Case(s) |
| --- | --- |
| S4-R1 | PV-COL-01 |
| S4-R2 | PV-COL-02 |
| S4-R3 | PV-COL-02 |
| S4-R4 | PV-COL-03 (export mirror PV-EXP-03) |
| S4-R5 | PV-COL-03 |
| S4-R6 | PV-COL-04 (restore/precedence), PV-COL-05 (defensive fallback), PV-COL-06 (per-browser/user inherit), PV-COL-08 (non-empty rule) |
| S4-N1 | PV-COL-07 |
| S4-E1 | PV-COL-08 |

### Story 5 — Metric Calculations
| Req | Case(s) |
| --- | --- |
| Definitions: Window (inclusive, floor 1) | PV-CALC-09, PV-CALC-16 |
| Definitions: Work-order date vs movement anchor | PV-CALC-16 |
| Definitions: Billed units | PV-CALC-10, PV-CALC-15 |
| Definitions: location scoping of all metrics | PV-FILT-10, PV-CALC-07 |
| S5-R1 (inventory source + core exclusion) | PV-CALC-01, PV-CALC-14 |
| S5-R2 (catalogue source + core exclusion) | PV-CALC-02, PV-CALC-14 |
| S5-R3 (returns source, live state, date anchor, row existence) | PV-CALC-03, PV-CALC-04 |
| S5-R4 Units Sold (inv / cat) | PV-CALC-01 / PV-CALC-02 |
| S5-R4 Units Returned | PV-CALC-03, PV-CALC-04 |
| S5-R4 Sold via WO / Sold via Parts Sale | PV-CALC-05 |
| S5-R4 Demand | PV-CALC-06 |
| S5-R4 Last Sale | PV-CALC-07 |
| S5-R4 On Hand / Min / Max | PV-CALC-08 |
| S5-R4 Turns / Yr | PV-CALC-09 |
| S5-R4b (reversal netting, billed-line family) | PV-CALC-11 (KNOWN BUILD-DELTA) |
| S5-R4a (five profitability formulas + null rules + raw-totals-rounded-once) | PV-CALC-10, PV-CALC-12 |
| S5-R5 (on-screen formats) | PV-CALC-13 (+ PV-ROW-08) |
| S5-R6 (internal on-hand cost never shown) | PV-COL-01 |
| S5-R7 (bases differ; identities; rounding half-away-from-zero) | PV-CALC-15, PV-CALC-13 (rounding), PV-CALC-16 |

### Story 6 — Exports
| Req | Case(s) |
| --- | --- |
| S6-R1 | PV-EXP-01 |
| S6-R2 | PV-EXP-02 |
| S6-R3 | PV-EXP-03 (KNOWN BUILD-DELTA) |
| S6-R4 | PV-EXP-04 |
| S6-R5 | PV-EXP-05, PV-EXP-06 |
| S6-R6 | PV-EXP-05 (PDF), PV-EXP-06 (CSV) |
| S6-R7 | PV-EXP-07 |
| S6-R8 | PV-EXP-06, PV-EXP-07 |
| S6-R9 | PV-EXP-09 |
| S6-R10 | PV-EXP-08 |
| S6-N1 | PV-EXP-10 |

### Story 7 — Visual Conformance
| Req | Case(s) |
| --- | --- |
| S7-R1 | PV-VIS-01 |
| S7-R2 / S7-R3 / S7-R4 / S7-R5 | PV-VIS-02 |
| S7-R6 | PV-VIS-03 |
| S7-R7 | Not a testable behavior (spec-governance rule: Story 7 is the normative source of truth) — noted in PV-VIS-01 notes; excluded with reason |

### §7 User Feedback Summary (messages)
| Trigger/message | Case(s) |
| --- | --- |
| Export success toasts (CSV/PDF, uppercase) | PV-EXP-09 |
| Export failure — server message | PV-EXP-10 |
| Export failure fallbacks (lowercase csv/pdf) | PV-EXP-10 |
| Empty state "Empty bays, endless possibilities. Get Going!" | PV-FILT-11 |
| Casing note (documented as-is) | PV-EXP-09/10 notes |

### §4 Terminology / §5 Assumptions
Encoded inside the relevant cases: Invoiced/Paid-only counting (PV-CALC-01/02/05
preconditions), parts-sale = separate workflow both feed the report (PV-CALC-05),
catalogue identification (PV-CALC-02), return-initiation model (PV-CALC-03),
Service/Parts two-type WO model (PV-CALC-05, PV-CALC-15).

## Exclusions (with reasons)
- **§2 Out of Scope items** (part-attribute editing beyond the read-only assertion,
  A/B/C/D movement groups, PO creation from the report, real-time sync/webhooks):
  no cases author the absent features; the one testable residue (Min/Max read-only,
  no edit affordance) is asserted in PV-CALC-08.
- **S7-R7** (spec-governance statement, not app behavior): excluded; noted above.
- **No REST/API contract exists in the spec** — PV-API-01..04 are generic
  backend-behavior cases (Standing Rule 4 placement) that assert observable
  server behavior only and invent no endpoints; the actual requests get recorded
  at VIU.

## Known-delta register (author-to-spec; expect build deviations until dev ships)
| Case | Delta |
| --- | --- |
| PV-CALC-11 (+ PV-CALC-02 note) | S5-R4b reversal netting: current billed-side queries do NOT net reversals (owner decision 2026-07-11; spec ahead of build) |
| PV-EXP-03 | S6-R3 export column order: current export appends re-enabled columns at the end instead of the canonical slot |
| PV-API-01/02/03, PV-ROW-04, PV-EXP-04, PV-FILT-04 | 2026-07-16 server-side model (server pagination/filter/sort, null-placement semantics, 366-day Custom cap) is the committed build target — spec ahead of current code by design |
| PV-ROW-09 | S3-N1 broadened keep-rule was implemented but marked LOCAL/uncommitted on the suite branch at spec time — confirm it reached the deployed build |

## VIU-confirm register (labels/states the spec does not pin — never invented)
| Case | To confirm live |
| --- | --- |
| PV-NAV-01 | Parts heading placement/styling in Reports navigation |
| PV-NAV-03 | Loading indicator appearance |
| PV-PERM-01 | Exact permission name in the roles screen ("Inventory Reports → View") |
| PV-PERM-03 | Access-denied state wording; shown-then-denied vs hidden-entry model (spec build-note) |
| PV-FILT-01/05/08 | Exact filter control labels (Type / Category / Vendor / Bin) and option labels |
| PV-FILT-04 | How the >366-day rejection is presented |
| PV-FILT-10 | Exact "All Locations" label |
| PV-ROW-01 | How an inventory row identifies its location on screen (no Location column pinned) |
| PV-COL-01 | Column-picker button label/icon |
| PV-COL-05/07 | Saved-view storage key/format (needed for stale/invalid seeding) |
| PV-EXP-10 | Failure-induction method |
| PV-API-01..04 | The actual backend requests/responses (no contract in spec) |

## Heavy data-seeding needs (flagged in case notes for VIU planning)
- Same part number stocked at TWO accessible locations (PV-ROW-01); catalogue part
  requested at two locations (PV-ROW-02); multi-location user (PV-FILT-10/13).
- Invoice + reversal/void + part-return + parts-sale-credit + cancellation flows
  on single parts inside one window (PV-CALC-01/03/04/06/11, PV-ROW-10).
- Drop-ship / negative-stock billed sale (no stock decrement) (PV-ROW-09, PV-CALC-15).
- Credit/adjustment revenue with zero billed units; $0-sell-price billed line
  (PV-CALC-12).
- Cored part with in-window activity (PV-CALC-14).
- Values crossing 1,000, negatives, and an exact .x45 rounding tie (PV-CALC-13).
- Work order with end date and invoicing date in different windows (PV-CALC-16).
- Browser-storage seeding for stale-schema / malformed saved views (PV-COL-05/07).

## Open questions / flags
- None PV-specific beyond the known-delta register. Epic/Jira key + QA env/flag
  status: NOT AVAILABLE — ask the user when VIU begins (per project scaffold).

## ADDENDUM 2026-07-28 — video-promotion + latest-info (user ruling)
- **PV-FILT-13 C30340 FLIPPED** (video P33): single-location user now expects NO Location
  filter — S2-E4 is overridden.
- **PV-FILT-10 C30337** now also covers the All-Locations per-row location identifier (video P10).
- **PV-FILT-01 C30328 / PV-FILT-09 C30336 / PV-ROW-05 C30345** reworded to the special-order
  MEANING of the 'Catalogue' Type choice; exact label = confirm in build (video P31 latest info;
  PV-EXP-08 C30382 notes-only). **PV-API-01/02** notes flag pagination details as confirm-live
  (video P30: pagination stands on every page).
- Detail: reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md; watch:
  ../SPEC-WATCH-2026-07-28.md (deadline 2026-08-04).
