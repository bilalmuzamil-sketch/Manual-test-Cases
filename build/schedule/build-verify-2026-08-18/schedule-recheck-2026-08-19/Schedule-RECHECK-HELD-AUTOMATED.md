# Schedule RE-CHECK 2026-08-19 — Automated cases HELD (Rule 71 — WRITE NOTHING)

Build `v3.8-d0e135e`. These carry `custom_atmstatus = 3` (Automated) and were NOT edited/re-stamped —
Rule 71 (ask the QA lead first). Verified present live where noted.

## OURS (created_by = 3) — 5 cases, held, write nothing
| C-id | Feature | Live on v3.8-d0e135e? |
|---|---|---|
| C43811 | Empty-cell menu → "Assign Work Order" opens a non-drag scheduling modal | **CONFIRMED present** — "Assign Work Order" is the first item of the admin empty-cell context menu (observed this pass) |
| C38847 | Business-hours toggle reveals a per-day (Mon-Sun) editor | Present per batch C; Working Hours settings page not re-opened this pass |
| C38848 | Edit Staff "Set working hours for this technician" toggle | Present per batch C; not re-driven this pass |
| C38849 | Technician with no custom hours inherits shop hours | Present per batch C; not re-driven this pass |
| C38850 | "Add Hours" appends a removable second range | Present per batch C; not re-driven this pass |

Note: C43811's stored body is truncated/incomplete (flagged batch B) — still needs a QA-lead-authorised
edit coupled with build-verify (Rule 71 refinement 2026-08-18). Not touched.

## FOREIGN (created_by = 1, Vladimir Tomovic) — 4 cases, HANDS-OFF (Rule 38)
C43569, C43570, C43571, C43980 — untouched, not counted in our tally.
