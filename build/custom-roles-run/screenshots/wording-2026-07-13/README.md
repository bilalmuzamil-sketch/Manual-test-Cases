# Wording evidence — 2026-07-13

Build-accurate labels for the Custom Roles & Permissions role editor were captured
**directly from the live STAGING build's shipped Vue chunks** (a more exact source
than pixel screenshots for label text). The extracted on-screen strings are in
`build-labels-from-shipped-chunks.json`, sourced from:
`app.staging.shopview.com/js/PermissionEditor.*.js`, `PermissionGrid.*.js`,
`WoSettingsRow.*.js`, `CrossTogglesSection.*.js`, `PageAndSettingsToggles.*.js`.
Role names + per-role permission sets were verified live via `GET /api/roles/{id}`
(see `roles-matrix-2026-07-13.md`). See `wording-glossary-2026-07-13.md` for the
consolidated glossary used to rewrite the cases.
