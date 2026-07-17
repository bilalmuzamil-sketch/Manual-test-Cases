# Filters — Test Case Source

**AUTHORED 2026-07-17: 79 cases across 14 sections (13 functional + 1 API).**
LOCAL ONLY — nothing pushed to TestRail (no writes without explicit user
permission).

- Files (schema mirrors `build/global-search/cases/`; one JSON array per file):
  - `cases-A-bar-status-collapse.json` — Filter Bar Layout and Visibility (3),
    Status Filter (6), Collapse and Expand (5)
  - `cases-B-people-asset-filters.json` — Customer (9), Lead Technician (7),
    Service Advisor (7), Asset on Site (6)
  - `cases-C-chips-tabs-persistence-url.json` — Active Filter Chips and Clear
    Filters (6), Empty State (2), Tab Behaviour (5), Persistence (4), URL State
    and Shareable Links (4)
  - `cases-D-mobile-api.json` — Mobile Filters (10), API — Work Orders List
    Filtering (5, `api_related: true`, Standing Rule 4)
- Per-case fields: id (`FLT-<AREA>-NN`), area, title, priority, type,
  permissions_required, preconditions/steps/expected (numbered arrays),
  design_ref, spec_ref, viu_status (all `VIU-Pending`), notes, api_related.
- Wording: build-accurate labels from `../design-notes.md` (final ZIP set);
  anything unconfirmable from the design carries a VIU-confirm note (24 cases).
  The design's "Lead Tehnician" typo is NOT codified — cases use the correct
  "Lead Technician" with typo-flag notes (design-notes §C.1).
- Scope: WORK ORDERS PAGE only (the spec's 12 stories). The Parts (9) and
  Reports (22) screens in the final design set have NO spec coverage — excluded
  with reason, PO question pending (see `../coverage-matrix.md` §C).
- Regenerate the import + ID map: `python3 build/filters/gen_import.py` →
  `testrail-import/filters-v1-testrail-import.csv`/`.xlsx` (Rule 16 canonical
  format) + `../testrail-id-map.csv` (Rule 8, C-ids blank until permitted push).

See `../PROJECT-STATE.md` for the canonical resume doc and
`../coverage-matrix.md` for the full requirement/frame → case map.
