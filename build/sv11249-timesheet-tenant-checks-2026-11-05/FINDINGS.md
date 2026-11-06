# SV-11249 — timesheet / labor-row tenant checks — FINDINGS (2026-11-06)

Branch: https://sv11249.qa.shopview.com build v26.45.2-ef57078. Production before: app.shopview.com v26.45.1-753355c, test org 72b2cc90 (Trucks Hill 2 / Truck Hill 1).
Mode: API (unattended). No Powertools plan on the ticket (QA Test Plan empty). QA assignee empty. Labels none.
Org A = staging-clone org (Heavy Duty b3c8c820 + Lethbridge f8a8b802). Org B = ZZAUTOTEST SV11249 Tenant B (registered on the branch, workplace 1070345f).

## Matrix (branch vs production)

| id | case | expect | branch | production |
|---|---|---|---|---|
| C0 | valid entry on own WO + line | 2xx | 201 saved | 201 saved |
| C1 | other company work order (with own line) | 4xx | 404 'Work Order' was not found. | n/a (needs a 2nd company) |
| C2 | other company line (with own WO) | 4xx | 404 'Line' was not found. | n/a (needs a 2nd company) |
| C3 | other company work order + its line | 4xx | 404 'Work Order' was not found. | n/a (needs a 2nd company) |
| C4 | other company technician | 4xx | 404 'Staff' was not found. | n/a (needs a 2nd company) |
| C5 | other company department (no WO) | 4xx | 404 'Department' was not found. | n/a (needs a 2nd company) |
| C6 | line that is not on the given WO (same location) | 4xx | 404 'Line' was not found. | 404 'Line' was not found. |
| C7 | own department (no WO) | 2xx | 201 saved | 201 saved |
| C8 | own WO in another location (by design allowed) | 2xx | 201 saved | 201 saved |
| W0 | valid labor row | 2xx | 201 saved | 201 saved |
| W1 | other company technician | 4xx | 404 'Staff' was not found. | n/a (needs a 2nd company) |
| W2 | other company WO + line | 4xx | 404 'Work Order' was not found. | n/a (needs a 2nd company) |
| W3 | other company line on own WO | 4xx | 404 'Line' was not found. | n/a (needs a 2nd company) |
| W4 | line not on the given WO | 4xx | 404 'Line' was not found. | 201 saved |
| W5 | own WO in another location | 4xx | 404 'Work Order' was not found. | 201 saved |
| M0 | move own entry to own WO+line | 2xx | 201 saved | 201 saved |
| M1 | move to other company WO + line | 4xx | 404 'Department' was not found. | n/a (needs a 2nd company) |
| M2 | move to own WO + other company line | 4xx | 404 'Line' was not found. | n/a (needs a 2nd company) |
| M3 | move to own WO + a line from another WO | 4xx | 404 'Line' was not found. | 404 'Line' was not found. |
| M4 | move with WO but no line | 4xx | 404 'Line' was not found. | 404 'Line' was not found. |
| M5 | move to other company department | 4xx | 404 'Department' was not found. | n/a (needs a 2nd company) |
| M6 | move own entry to own department | 2xx | 201 saved | 201 saved |
| M7 | move with WO + made-up line id | 4xx | 404 'Line' was not found. | 404 'Line' was not found. |
| M8 | move an entry from another location to a department | 4xx | 404 'Technician Task Record' was not found. | 201 saved |
| C9 | technician based in the other location, own WO+line | info | 201 saved | n/a (needs a 2nd company) |
| W6 | labor row for a technician based in the other location, own WO | info | 201 saved | n/a (needs a 2nd company) |
| M9B | move own entry to own WO+line in the other location (destination = organization boundary, by design) | 2xx | 201 saved | n/a (needs a 2nd company) |

Extra (earlier, branch): foreign WO + own department on move = 201, foreign WO id ignored, same as a made-up WO id (M12 201); org B line shows only its own task afterwards.

## Open question for the QA lead (held — not posted)
C9/W6: Michelle Ingram (Lethbridge-only staff, default workplace Staging Lethbridge - 4310) is accepted as technician on a Heavy Duty work order by both create endpoints (201). Ticket 'Fix' says resolve staff with findByIdInOrganization (organization only) and the Location bullet limits location checks to the WO of work-orders/tasks/create and the moved entry; but done-when bullet 1 reads 'rejects a line, work order, technician or department from another organization or location'. Reading not certain -> ask before passing (Rule 96c).
Steps for him: log in sv11249 as admin in Staging Heavy Duty - 9919, open any HD work order -> Lines -> add labor/time for a technician; the picker/API accepts Michelle Ingram (Lethbridge). API: POST /api/work-orders/tasks/create {work_order_id:<HD WO>, line_id:<its line>, staff_id:04ed8d82-a748-4e23-b29d-f3f40c711b04} -> 201.

## Side observation (API-only, Rule 94 — ask, do not file)
A location created through POST /api/workplaces/create without color makes POST /api/work-orders/create return 500 (Sentry: WorkplaceDto color null). The New Location screen always sends a colour.

## Pre-post gate
Not posted yet (held on the question). Comment draft: jira/pass.html. Before posting: re-read build marker + ticket status/comments.

Learning check: nothing new beyond the playbook notes already recorded for second-organisation setup.
