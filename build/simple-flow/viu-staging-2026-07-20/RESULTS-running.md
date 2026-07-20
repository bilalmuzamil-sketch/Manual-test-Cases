# Simple Flow — Staging live VIU results (2026-07-20)

Host: app.staging.shopview.com / api.staging.shopview.com (shared d55bc308 org). Admin session, live.

## SF-CORE-18 (C29899) — API pre-resolve-cores — VIU-Verified
Endpoint LIVE: `POST /api/work-orders/{id}/pre-resolve-cores`
Payload schema (discovered live): `{cores:[{partRequestId, isCoreOk:<bool>}]}`.
Observed on WO 316441e5 (vendor core PR dcc299b8, un-received `authorized_to_order`, core_charge 23):
- POST isCoreOk=true  -> 201 {"data":{"resolvedCount":1}}; core_resolution => "ok";  cores_pending 1->0
- POST isCoreOk=false -> 201 {"data":{"resolvedCount":1}}; core_resolution => "not_ok"; cores_pending 0
- NO side effects: pr_status stayed `authorized_to_order`, order_id null, quantity_remaining 12 (unchanged), total_core_charge 276 (unchanged) — no WorkOrderPart / order / qty change.
- isCoreOk=null -> 400 "This value should not be null" (decision-only; NULL is the initial undecided state, endpoint cannot un-set).
Evidence: SF-CORE-18-api-evidence.json. Matches all 3 expected clauses. => VIU-Verified.
