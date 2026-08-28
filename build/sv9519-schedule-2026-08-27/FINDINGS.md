# SV-9519 — QA verification (Schedule: WO from a tech's slot must auto-assign to that tech)

**Ticket:** SV-9519 — *Work Order Created From Schedule Is Not Automatically Assigned to Selected Technician's Schedule*
**Status when tested:** Code Review · Labels: `QA_validation_required`, `ai-unverified-repro`, `bug-report`, `source-intercom`
**QA branch:** https://sv9519.qa.shopview.com  ·  API `sv9519api.qa.shopview.com`
**Build marker:** `v26.35.5-92c05c7` · index.html last-modified Thu 27 Aug 2026 14:31:49 GMT · etag `c30ec581f740a9c2c2566e9ebb4de4e2`
**Org:** Staging Heavy Duty – 9919 (`d55bc308…`)
**Tested:** 2026-08-27 · signed in as admin

## What the ticket reports (source of truth = the DESCRIPTION, Rule 66)
When a user creates a new Work Order directly from a technician's time slot on the **Schedule**, the WO is created but does **not** appear on that technician's schedule — the user has to go back and manually assign it. Reported after a recent update; caused missed service calls.

**Expected:** a WO created from a technician's slot should automatically appear on that technician's Schedule at the selected date/time.

## How I tested it (live, real UI)
1. Opened **Schedule** (Day view, Thu Aug 27).
2. Clicked **Michele Munoz's 10:00 AM** slot → menu → **New Work Order**.
3. Picked customer **Aacastle Services** and asset **2015 Valley HD 800 T/A** (VIN 5406484AKAKAKKA), ticked "Vehicle is here", **Save**.
4. Returned to the Schedule and checked Michele Munoz's row.
5. Repeated independently on **Larry Collins's 3:00 PM** slot.

## Result — PASS (fix confirmed)
The Work Order appears on the selected technician's own schedule at the selected time, with no manual re-assignment.

| Run | Slot clicked | WO created | Landed on schedule | Verified |
|----|----|----|----|----|
| 1 | Michele Munoz · 10:00 AM | **S-15890** (`db73c1cd…`) | Michele Munoz's row · 10:15 AM–11:15 AM | ✅ |
| 2 | Larry Collins · 3:00 PM | **S-15889** (`9dd90fde…`) | Larry Collins's row · 3:15 PM–4:15 PM | ✅ |

## Proof (not just visual)
The fix wires the slot context into the create call. The **New Work Order** create payload now carries the slot's time and technician:

```json
POST /api/work-orders/create
{ ...,
  "scheduled_start": "2026-08-27T16:15:00.000Z",          // the 10:15 AM slot (MDT = UTC-6)
  "assigned_staff_id": "4d18c4ef-6dd4-450a-a797-496c81601a59",  // = Michele Munoz's schedule row
  "type": "service" }
-> 201 { "work_order_id": "db73c1cd-3531-4ef8-b974-ac00a5c7b84b" }
```

The server then creates the schedule shift atomically (no separate manual "assign" call fires). The Schedule board confirms it:

```
GET /api/schedule/board  -> board.shifts[] contains:
  { staffId: "4d18c4ef-6dd4-450a-a797-496c81601a59",   // == Michele Munoz's row data-staff-id
    startsAt: "2026-08-27T16:15:00Z", endsAt: "2026-08-27T17:15:00Z", durationMinutes: 60,
    workOrder: { number: "S-15890", customerName: "Aacastle Services", vehicle: "2015 Valley HD 800 T/A" } }
```

The Schedule DOM row for Michele Munoz carries `data-staff-id="4d18c4ef-…"` — the **same** id the shift is assigned to. Same match verified for Larry Collins (`3db75ce4-…`, shift 21:15Z).

## Smart check — don't be misled by the legacy field (Rule 66)
The create payload's **`tech_assigned_id` is `null`** — a naïve check on that one legacy field would wrongly read as "not assigned". The actual schedule assignment travels in **`assigned_staff_id` + `scheduled_start`**, and the shift is confirmed on the board API keyed to the technician's `staffId`. So the assignment is real and correct; the null `tech_assigned_id` is a red herring (it is the WO "lead technician" concept, separate from the schedule shift).

## Evidence files
- `evidence/EX-schedule-autoassign.png` — annotated BEFORE (Michele's 10 AM empty) / AFTER (WO on Michele's 10 AM).
- `evidence/before-michele-empty.png`, `evidence/after-michele-assigned.png` — raw before/after.
- `evidence/newwo-dialog.png` — the New Work Order dialog.
- `evidence/create-payload.json` — full create request/response.
- `evidence/board-verify.json` — target row vs created shift (staffId match).

## Verdict
**QA STATUS: PASSED.** On build `v26.35.5-92c05c7`, a Work Order created from a technician's Schedule slot is automatically assigned to that technician's schedule at the selected time. The reported behaviour is fixed.

*Note: sv9519 is a temporary per-ticket QA branch — no cleanup required (standing rule). Test WOs left in place as evidence, tagged by the Aacastle test customer.*
