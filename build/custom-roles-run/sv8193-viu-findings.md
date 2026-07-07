# SV-8193 — VIU on STAGING: does deleting a COMPLETED inspection actually succeed?

**Date:** 2026-07-07 · **Env:** `app.staging.shopview.com` / `api.staging.shopview.com`
**Jira:** SV-8193 (Bug) · **Spec:** SV-8095 AC3B (delete/reopen a completed
inspection requires **WO Lines: Delete**). Related SV-7509, SV-7985.

## Question settled
The recorded TestRail tests (C27659 Technician, C27672 Parts Manager) only proved
the remove (**bin**) button is *shown* on a completed inspection for roles that
have WO Lines **View/Edit** but **not Delete**. Open question: when that button is
clicked, does the completed inspection **actually get deleted** (backend allows)
or is the delete **blocked (403)**? This drives the correct ticket title.

## The exact call the bin button issues (from the SPA bundle)
- Inspection service (`app/js/index.bwofsBuB.js`):
  `removeInspection: id => t.delete(\`inspections/${id}\`)` → i.e.
  **`DELETE /api/inspections/{inspectionId}`**.
- Wired to the bin in `WorkOrder.CDqF4G8e.js` (`removeInspection(v)` →
  "Inspection removed." toast). Related: attach =
  `POST /api/work-orders/lines/{lineId}/inspections {templateId}`; submit =
  `POST /api/inspections/{id}/submit {signatureStyle}`; report/PDF =
  `POST /api/inspections/{id}/report`; reopen =
  `POST /api/inspections/{id}/reopen`; list = `GET /api/work-orders/{woId}/inspections`.

## Test setup
- WO **S9-25052** `310fe4fa-9dfe-46cd-92ba-1dbe0ac75c67`, line
  `338562b6-...` ("ZZAUTOTEST story line"). Template "Test Template"
  `0d75f8d7-...` v37.
- A genuine **COMPLETED** inspection was created per role (attach → submit with
  signature → generate report). Verified `status:"completed"`, `completedAt` set,
  PDF report generated, and it renders in the WO Lines tab as
  **"Inspection · Test Template v37 · Completed"** with a red bin (`delete_outline`).
- The DELETE was issued under the **tech user's own session** (quick-login
  `{key:'tech'}`), i.e. the exact call the bin fires — not an admin call.

## Per-role results

| Role | tech perms (live) | Bin (delete_outline) visible? | Delete call | HTTP status | Completed inspection actually deleted? | Evidence |
|---|---|---|---|---|---|---|
| **Technician** (`6e8265bf`) | `workOrderLinesCreateAndEdit`=Y, `workOrdersView`=Y, `workOrderLinesDelete`=**N** | **YES** | `DELETE /api/inspections/ccea8d0e-273b-4c19-9330-764b2666de27` | **204 No Content** | **YES** — verify `GET` → **404**, WO inspections list empty | `technician_10_bin_visible.png`, `technician_03_line_expanded.png` |
| **Parts Manager** (`e049b772`) | `workOrderLinesCreateAndEdit`=Y, `workOrdersView`=Y, `workOrderLinesDelete`=**N** | **YES** | `DELETE /api/inspections/771b12d7-3cda-4a25-a654-bd14f9c9efbe` | **204 No Content** | **YES** — verify `GET` → **404**, WO inspections list empty | `partsmanager_03_line_expanded.png` |

Response body for both DELETEs: empty (204). Verify `GET /api/inspections/{id}`
returned `404 {"errors":[{"error":"'resource' was not found."}]}` and
`GET /api/work-orders/{wo}/inspections` returned `{"inspections":[]}` afterward —
the completed inspection was genuinely removed, not just hidden.

## Consistency with the enforcement model
Fully consistent with our documented model (CLAUDE.md "Key findings"): the backend
enforces only resource-level View/Edit; **granular Delete is a front-end display
gate the API does NOT enforce.** Here the backend accepted `DELETE /api/inspections/{id}`
from a user **without** `workOrderLinesDelete` and permanently deleted a
**completed** inspection. The FE shows the bin on WO Lines **Create & Edit** alone,
and the backend does not add any completed-status / Delete-permission check — so
the bin is not just wrongly shown, it **works**.

## VERDICT
**The bug is (A): a role with WO Lines View/Edit but NOT Delete (Technician, Parts
Manager) can ACTUALLY delete a completed inspection — the backend allows it (204,
inspection gone).** It is **NOT** merely a wrongly-shown button that the backend
would block (there is no 403). Both the FE display gate (SV-8095 AC3B not
implemented in the UI) **and** the backend enforcement are missing.

**Recommended ticket title:** option **(A)** — e.g.
*"Technician / Parts Manager (WO Lines V/E, no Delete) can delete a completed
inspection — bin shown AND backend allows the delete (204); SV-8095 AC3B not
enforced in FE or API."*
(Title (B) "button shown but deletion is blocked" is **inaccurate** — deletion is
not blocked.)

## Safety / cleanup
- **Exact-user-match** used on every role change: staff_id
  `6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa` (tech@shopview.com), workplace
  `b3c8c820-...`.
- Both throwaway inspections were the delete targets (already gone). The WO/line
  pre-existed and were already `ZZAUTOTEST`-named; nothing else created.
- **Tech restored to Time Clock** at the end and **verified**: role now
  `9834b7ec-4625-4fb7-9a82-b69de3703e48` ("Time Clock User"), perms =
  scheduleView / timesheetsView / workOrdersView (no WO Lines perms).

## Environment notes (durable-fact changes found this run)
- Staging re-seeded: role ids changed. Live org `d55bc308` roles — **Technician**
  `6e8265bf-1bfd-41be-b30a-7f17e7c4154b`, **Parts Manager**
  `e049b772-3bb9-4cc8-b756-13072fa9ecb2`, **Time Clock User**
  `9834b7ec-4625-4fb7-9a82-b69de3703e48`. The old Time Clock id
  `77b069d1-...` no longer exists; `build/testing-tools/staging-restore-tech.mjs`
  was updated to the live id.
- Tech staff_id `6fb22c1b-...` and workplace `b3c8c820-...` are still valid
  (confirmed from the tech quick-login `details`). Note: the tech test account is
  NOT returned in `GET /api/staff` (filtered), but quick-login `{key:'tech'}`
  still maps to user_id `a7fd0a88-...` / staff_id `6fb22c1b-...`.
- At the start of this run, Tech was found already on the **Technician** role (not
  Time Clock); it was restored to Time Clock per standing rule.
</content>
</invoke>
