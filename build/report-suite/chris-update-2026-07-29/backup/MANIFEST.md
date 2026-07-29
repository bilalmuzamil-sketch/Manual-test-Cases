# Chris-update 2026-07-29 — pre-edit backups (LOCAL delta pass, NO TestRail writes)

Source: `../chris-message-2026-07-29.md` (verbatim). Every touched case's verbatim
PRE-EDIT body is here as `<internal-id>.json`. To recover a case, copy the backup body
over the entry in the listed cases/ file (TU-COL-01 is NEW — recover by deleting it).

| Internal ID | File | Delta |
|---|---|---|
| SBC-LBL-01 | cases-sbc-B-tree-links-sorting.json | D1 VIN-first identifier (re-ruled from serial) |
| SBC-LBL-04 | cases-sbc-B-tree-links-sorting.json | D1 notes-only: duplicate-label context serial->VIN |
| SBC-EXP-01 | cases-sbc-C-calcs-columns-exports-persistence.json | D2 four exact menu items |
| SBC-EXP-16 | cases-sbc-C-calcs-columns-exports-persistence.json | D2 Summary/Expanded both formats, exact labels |
| SBC-EXP-03 | cases-sbc-C-calcs-columns-exports-persistence.json | D2 scoped to Expanded CSV + D3 Locations line |
| SBC-EXP-11 | cases-sbc-C-calcs-columns-exports-persistence.json | D2 scoped to Expanded PDF body |
| SBC-EXP-09 | cases-sbc-C-calcs-columns-exports-persistence.json | D3 PDF header Locations line (reverses location-not-shown) |
| SBR-EXP-02 | cases-sbr-D-exports-assignments-states-mobile-visual-worep-api.json | D3 Locations line in exports |
| PV-EXP-02 | cases-pv-D-exports-visual-api.json | D3 Locations line in exports |
| TU-EXP-04 | cases-tu-C-links-exports-location.json | D3 Locations line in exports |
| IV-EXP-02 | cases-iv-D-persistence-sorting-exports.json | D3 Locations line in exports |
| WIP-EXP-02 | cases-wip-D-persistence-exports.json | D3 Locations line in exports |
| SBC-LOC-03 | cases-sbc-A-access-filters.json | D3 on-screen location-scope indicator |
| SBR-LOC-03 | cases-sbr-A-access-filters.json | D3 on-screen location-scope indicator |
| PV-FILT-10 | cases-pv-A-access-permissions-filters.json | D3 on-screen location-scope indicator |
| TU-LOC-02 | cases-tu-C-links-exports-location.json | D3 on-screen location-scope indicator |
| IV-LOC-02 | cases-iv-C-asof-filters-location.json | D3 on-screen location-scope indicator |
| WIP-FLT-06 | cases-wip-C-summary-totals-filters.json | D3 on-screen location-scope indicator |
| PV-FILT-01 | cases-pv-A-access-permissions-filters.json | D4 exact label Special Order |
| PV-FILT-09 | cases-pv-A-access-permissions-filters.json | D4 exact label Special Order |
| PV-ROW-05 | cases-pv-B-rowmodel-columns.json | D4 exact label Special Order |
| PV-EXP-08 | cases-pv-D-exports-visual-api.json | D4 notes-only: export value Special Order confirmed |
| TU-COL-01 | cases-tu-D-visual-api.json | D5 NEW case (no backup - did not exist) |
| PV-EXP-05 | cases-pv-D-exports-visual-api.json | D6 same logo treatment (PV lacked coverage) |

## 2026-07-29 WIP-answer wave (Chris: "A is the correct answer" — VIN chain for WIP)

Source: `../wip-identifier-answer-2026-07-29.md` (verbatim; user-relayed, last-update-wins).
Applied by `../apply_wip_answer_2026-07-29.py`, LOCAL ONLY (no TestRail writes).

| Internal ID | File | Delta |
|---|---|---|
| WIP-COL-05 | cases-wip-B-columns-calc-sorting.json | Asset cell serial -> VIN chain (VIN, then Unit #, then plate) + tester VIN-terminology note |
| WIP-SORT-03 | cases-wip-B-columns-calc-sorting.json | Asset sort key serial -> the identifier shown (VIN chain) |
| WIP-FLT-03 | cases-wip-C-summary-totals-filters.json | Filter options/type-ahead serial -> VIN chain + tester VIN-terminology note |
| WIP-EXP-07 | cases-wip-D-persistence-exports.json | Expected #4 caveat re-based on the VIN chain (was serial) |
| SBC-LBL-01 | cases-sbc-B-tree-links-sorting.json | NOTES-ONLY: "WIP question queued" residue closed (answered A). Backup = SBC-LBL-01.pre-wip-answer-edit.json (the existing SBC-LBL-01.json = the earlier D1 backup, untouched) |
