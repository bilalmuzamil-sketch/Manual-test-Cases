# SV-12269 — API: a location created without a colour breaks work orders and the Locations list (filed 6 Nov 2026)
Found while testing SV-11249 on sv11249 (build v26.45.2-ef57078). QA lead ruling 2026-11-06: file it, say API-only, give full API details, tag Chris (Open API release) to confirm fix vs Obsolete.
- Reproduced twice (ZZAUTOTEST NoColour 90649 = 452f3c1d…, then 81408 = 908a63f3…). Transcripts: ../sv11249-timesheet-tenant-checks-2026-11-05/ev/colour-transcript{,2,4}.json
- WO create 201 → (create colour-less location 201, color null) → WO create 500 (req 37776e77…), GET /api/workplaces 500 (req 9037e5a3…); Locations screen empty + 2 red errors (ev colour-locations-broken.png).
- Repair proven: POST /api/workplaces/change with full object + color '#888888' → 201; GET /api/workplaces 200; WO create 201 (colour3.mjs).
- Sentry SHOPVIEW-API-34P: WorkplaceDto::__construct() Argument #9 ($color) must be string, null given (WorkOrderSnapshotDataProvider.php:600).
- Branch LEFT BROKEN on purpose (location 81408) so the reader sees it at /administration/locations.
- Ticket: Bug, Medium, parent SV-11135, Product Area Work Orders, Relates SV-11249; description + exhibit (media 889d0902…) read back; Chris tagged in comment 80301.
- Learning check: nothing new beyond the recipe (workplace create/change payloads) — added to playbook below.
