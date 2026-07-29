# Video-promotion backup MANIFEST (2026-07-28)

**Purpose (user instruction 2026-07-28):** if Chris Ward never ratifies the kickoff-video items
into the six Confluence specs, the original cases must be recoverable EXACTLY. Every file in
this folder is the **verbatim PRE-EDIT body** (exact pre-edit source, extracted from git HEAD
`ddf8c16` before this session's edits) of a case touched by the 2026-07-28 video-promotion +
open-decision passes. One file per case: `<internalID>_C<id>_pre-edit.json`.

**To recover a case:** replace its object in the owning `build/report-suite/cases/*.json` file
with the backed-up body (the filename's internal ID locates it; the owning file is listed
below), then regenerate deliverables via `build/report-suite/gen_import.py` and re-merge C-ids
into `testrail-id-map.csv`. Nothing was pushed to TestRail, so TestRail itself still holds the
pre-edit wording — recovery is local-only.

Edit detail (full quotes) lives in
`../reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md`. Date for all rows:
**2026-07-28**.

## Backed-up cases (27)

| Internal ID | C-id | Owning file (cases/) | What changed | Driving video anchor | Overridden spec line |
|---|---|---|---|---|---|
| SBC-LBL-01 | C30134 | cases-sbc-B-tree-links-sorting.json | Identifier rewritten: serial number replaces Unit→plate→VIN chain | P24 29:54–30:46 | SBC S8-R8 "· Unit {unit}" → plate → "VIN …{last 8}" |
| SBC-LBL-02 | C30135 | cases-sbc-B-tree-links-sorting.json | Notes/refs only (S8-R9 rule kept) | P24 29:54–30:46 | — (context edit) |
| SBC-LBL-03 | C30136 | cases-sbc-B-tree-links-sorting.json | Notes/refs only (S8-R10 rule kept) | P24 29:54–30:46 | — (context edit) |
| SBC-LBL-04 | C30137 | cases-sbc-B-tree-links-sorting.json | Notes/refs only + title shortened to 73 | P24 29:54–30:46 | — (context edit) |
| WIP-COL-05 | C30470 | cases-wip-B-columns-calc-sorting.json | Asset cell line 1 = serial number; "(no unit #)" placeholder unpinned | P24 29:54–30:46 | WIP S4-R7 unit number line 1 bold; §4 |
| WIP-FLT-03 | C30500 | cases-wip-C-summary-totals-filters.json | Type-ahead/options = serial number or VIN; note updated to native+toggle dropdown (P12 latest info) | P24 29:54–30:46 + P12 15:49–16:54 | WIP S7-R4/S7-R5 unit number matching |
| WIP-SORT-03 | C30485 | cases-wip-B-columns-calc-sorting.json | Asset sort key = serial number | P24 29:54–30:46 | WIP S4-R9 "sorts by unit number" |
| WIP-EXP-07 | C30516 | cases-wip-D-persistence-exports.json | Serial-number data caveat added to Unit/Branch header limitation | P24 29:54–30:46 | WIP S9-E1 (header predates video) |
| SBC-EXP-01 | C30159 | cases-sbc-C-calcs-columns-exports-persistence.json | Menu = CSV + PDF only, NO Print item | P25 31:14 | SBC S14-R1 "Print" third item; Story 16 |
| SBC-EXP-13 | C30171 | cases-sbc-C-calcs-columns-exports-persistence.json | Marked Retire-Proposed (Print-only case); body left as authored | P25 31:14 | SBC Story 16 S16-R3..R5, S16-N1, §7 |
| SBC-EXP-14 | C30172 | cases-sbc-C-calcs-columns-exports-persistence.json | Print leg removed from the 10k-cap negative; title shortened | P25 31:14 | SBC S16-R6 (Print obeys cap) |
| SBC-LOC-03 | C30111 | cases-sbc-A-access-filters.json | Added All-locations per-row location-identifier expectation | P10 40:58–41:20 | SBC spec: no Location column (tree only) |
| SBR-LOC-03 | C30215 | cases-sbr-A-access-filters.json | Added All-Locations per-row location-identifier expectation | P10 40:58–41:20 | SBR spec: no Location column |
| PV-FILT-10 | C30337 | cases-pv-A-access-permissions-filters.json | Added All-Locations per-row location-identifier expectation | P10 40:58–41:20 | PV S4-R4: no Location column in 20-col set |
| TU-LOC-01 | C30442 | cases-tu-C-links-exports-location.json | Added All-Locations location-identifier expectation (pooled-rows wording) | P10 40:58–41:20 | TU S9-R4: pooled rows, no identifier |
| IV-LOC-01 | C30574 | cases-iv-C-asof-filters-location.json | Added All-locations per-row location-identifier expectation | P10 40:58–41:20 | IV S3-R1: no Location column |
| SBR-LOC-04 | C30216 | cases-sbr-A-access-filters.json | FLIPPED: single-location user sees NO Location filter | P33 46:10–46:28 | SBR S21-N1 "still sees the filter" |
| TU-LOC-05 | C30446 | cases-tu-C-links-exports-location.json | FLIPPED: single-location user sees NO Location filter | P33 46:10–46:28 | TU S9-N1 "still sees the filter" |
| IV-LOC-04 | C30577 | cases-iv-C-asof-filters-location.json | FLIPPED: single-location user sees NO Location filter | P33 46:10–46:28 | IV S7-N1 "still sees the filter" |
| PV-FILT-13 | C30340 | cases-pv-A-access-permissions-filters.json | FLIPPED: single-location user sees NO Location filter | P33 46:10–46:28 | PV S2-E4 "STILL SEES the Location filter" |
| TU-NAV-01 | C30392 | cases-tu-A-access-hours-lostlabor.json | Added below-existing-links nav placement expectation | P3 05:11–05:19 | TU S1-R1 (order-agnostic — tightened, not contradicted) |
| PV-FILT-01 | C30328 | cases-pv-A-access-permissions-filters.json | Type options reworded to special-order meaning; label VIU-confirm (both labels noted) | P31 43:34–44:12 | PV S2-R1 "Both, Inventory, Catalogue" |
| PV-FILT-09 | C30336 | cases-pv-A-access-permissions-filters.json | "Type = Catalogue" wording → special-order (catalogue) choice; label VIU-confirm | P31 43:34–44:12 | PV S2-R8 |
| PV-ROW-05 | C30345 | cases-pv-B-rowmodel-columns.json | Type column value wording → special-order kind; label VIU-confirm | P31 43:34–44:12 | PV S3-R5 "Inventory or Catalogue" |
| PV-EXP-08 | C30382 | cases-pv-D-exports-visual-api.json | Notes/refs only (exported Type value may rename) | P31 43:34–44:12 | — (context edit) |
| PV-API-01 | C30388 | cases-pv-D-exports-visual-api.json | Notes/refs only (pagination stands; details VIU-confirm) | P30 45:05–45:42 | — (context edit) |
| PV-API-02 | C30389 | cases-pv-D-exports-visual-api.json | Notes/refs only (pagination stands; details VIU-confirm) | P30 45:05 | — (context edit) |

## Video-driven ADDITION (no pre-edit state — delete-to-recover)

| Internal ID | C-id | Owning file (cases/) | What it is | Driving video anchor |
|---|---|---|---|---|
| SBC-EXP-16 | new — no C-ID yet | cases-sbc-C-calcs-columns-exports-persistence.json | NEW case: compressed (summary) SBC download alongside the expanded one. **Recovery = delete the case object** (it was never in TestRail). | P21 32:10–33:03 + 48:39 |

## Not backed up (deliberate)

- **TU column selector (P18):** NO-OP — no TU column-selector case exists; nothing touched.
- **Pagination (P30) on IV/SBC/SBR:** NO-OP — their pagination cases already match Stefan's
  "pagination on every page" and were not touched (only PV-API-01/02 got a notes flag, backed up
  above).
- **PV-NAV-01 / IV-NAV-01 (P2):** NO-OP — already expect the "Parts" nav section; not touched.
