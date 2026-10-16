# SV-11317 — Tech View opens on the design's 13 columns — staging, 16 Oct 2026
Build v26.40.19-754919e. PRD v63→v64 during the pass (v64 only changes S3-E2 board scrollbar) — comment cites v64; S5-R4, S5-R4a, S7-R7, S2-R4 word-identical.
## Matrix
| # | Check | Observed |
|---|---|---|
| 1 | Admin (prefs have no Tech View column key = never changed) | 13 headers: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created On, Total Price |
| 2 | Tech user, Technician role (reset-to-template checked: already at template, 6 perms, seeFinancialData false; prefs had no Tech View column key) | 12 headers, same order, Total Price absent from table and Columns menu |
| 3 | Add On Site / VIN / Lead Technician (as Tech) | each appears in place (On Site first; VIN after Asset; Lead Technician after Service Advisor); removed again → back to 12 |
| 4 | S5-R4a / S7-R7 | Status/Number/Customer not in menu; Assigned Techs off → gone, on → back after Lines |
| 5 | List unchanged | List Columns menu staging = production, same 14 options, same order |
Tech user's own columns returned to defaults after the toggles (its prefs now carry the default state).
## Recording / post
`ev/sv11317-tech-view-columns-staging-recording-voiceover.mp4` 29.7 s, admin, no settings changed; anchors via `testing-tools/anchor_mux.py`. Comment **78910** (attachments 62481, 62482); gate: build unchanged, ticket 2 Chris comments only, PRD v64; read back panel/image/table 6/ol 4/mp4.
