# TestRail Audit Log — Time Clock API Enforcement cases — 2026-07-13

TestRail writes authorized by the QA-lead task ("Author Custom Roles API test cases
... Create via add_case" + "create an API-titled sub-section via add_section").
Project 1 / suite 1 "Master". All writes verified.

## add_section
- **Section 4091** created — "API — Time Clock Role Enforcement (SV-7388)",
  parent 3527 (Custom Roles - (Revised)). HTTP 200.

## add_case (custom_atmstatus:3, custom_automation_type:0) — all HTTP 200
| C-ID | viu_status | Title |
|---|---|---|
| C29446 | VIU-Verified | Time Clock user CAN read Work Orders via API |
| C29447 | VIU-Verified | Time Clock user CAN read the Schedule via API |
| C29448 | VIU-Verified | Time Clock user is blocked from the Parts / Inventory API |
| C29449 | VIU-Verified | Time Clock user is blocked from the Purchase Orders API |
| C29450 | VIU-Verified | Time Clock user is blocked from the Customers list API |
| C29451 | VIU-Verified | Time Clock user is blocked from the Reports (AP Aging) API |
| C29452 | VIU-Verified | Time Clock user is blocked from the Staff and Roles API |
| C29453 | VIU-Verified | Time Clock user is blocked from the Integrations API |
| C29454 | VIU-Verified | Time Clock user is blocked from the Departments API |
| C29455 | VIU-Verified | Time Clock user cannot change organization Settings via API |
| C29456 | VIU-Verified | Time Clock user cannot delete a Customer via API |
| C29457 | Deviation | BUG: Time Clock user CAN read organization Settings via API |
| C29458 | Deviation | BUG: Time Clock user CAN read Taxes / Finance data via API |
| C29459 | Deviation | BUG: Time Clock user CAN create a Customer via API |
| C29460 | Deviation | BUG: Time Clock user's Work Order create is not blocked with 403 |

15 cases created (C29446–C29460), 0 errors. Two verified back via get_case (200).
No update_case/delete_case performed. Local source: cases-2026-07-13/C2944*.json / C2945*.json / C2946*.json.

## Env / role handling
- Tech staff 6fb22c1b assigned Time Clock role be58f381 (POST /api/staff/{id}/change → 201),
  exact email match tech@shopview.com. Left on Time Clock = the Custom Roles baseline.
- Env drift: shared staging org role ids were RESEEDED; stale a0359055 Time-Clock id no
  longer exists (invalid role_id → 500). Current Time Clock User = be58f381-52fd-4958-9961-2d207bd1f09c.
- Cleanup: 2 ZZAUTOTEST customers created by the create-leak probe were DELETED (201 each);
  no work order persisted; no settings changed.
