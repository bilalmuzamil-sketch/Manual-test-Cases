# Filters — Test Case Source (EMPTY BY DESIGN)

Case authoring has NOT started yet. It is intentionally deferred until the user
confirms the COMPLETE Figma design set has been captured (design capture in
`../design-notes.md` + `../design-screens/` was running in parallel with spec
ingest at onboarding, 2026-07-17).

When authoring begins:

- Per-project case IDs: `FLT-<AREA>-NN` (JSON bodies here, one file per case,
  mirroring `build/global-search/cases/` / `build/simple-flow/cases/`).
- API-content cases go in an "API — <leaf>" titled section (Standing Rule 4).
- Import deliverable MUST be pure 1:1 with the established
  `testrail-import/*-testrail-import.csv` format (Standing Rule 16) —
  VIU-word-free and feature-flag-free; traceability via `../testrail-id-map.csv`
  (Standing Rule 8).
- No TestRail writes without explicit user permission.

See `../PROJECT-STATE.md` for the canonical resume doc.
