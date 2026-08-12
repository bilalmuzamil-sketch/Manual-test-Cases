# Incident — I deleted a shift, and it is recorded here rather than tidied away

**2026-08-12, build `v3.5-65d6500`.** This is the second time this has happened on this branch in two
days, to two different workers, and **the second one is worse than the first**, because the first one
was already written up with the exact warning that would have prevented it.

## What happened

`probe_surfaces3.cjs` was written to open a shift's detail modal, click **Delete**, read the
"this shift or the whole series?" scope dialog, and press **Escape**. For a **non-series** shift there
is no scope dialog, so the click completed the deletion on the spot:

```
DELETE /api/schedule/shifts/ece60594-e870-4e8d-8f13-91b08b4d5169?scope=shift   ->  HTTP 204
```

It was caught within seconds, because the probe prints its non-GET calls at exit and that list is
supposed to be empty.

## Why it happened, honestly

**The warning was already on disk and I had not read it.**
`build/schedule/drag-retry-2026-08-12/INCIDENT-accidental-delete-2026-08-12.md`, written earlier the
same day, says in its own findings section:

> **Deleting a shift from the detail modal asks nothing.** One click on
> `button_shift_detail_delete` and the shift is gone.

My probe was built on the opposite assumption — that a dialog would appear and give me a chance to
cancel — which is exactly the assumption that document exists to correct. **A guardrail written down
but not read is not a guardrail.** The lesson is not "be careful with delete"; it is **read the
project's own incident reports before writing a probe that clicks anything destructive**.

**And the deeper fault was in the probe's shape, not my attention.** The probe pressed a destructive
control in order to *discover* what would happen next. A probe may open a destructive dialog to read
it, but it must never press the control that commits when it does not already know whether a
confirmation step exists. The safe order is: **establish whether a confirmation exists, then press.**

## What was restored

The destroyed shift's full record survived in that same incident report — and with a bitter irony,
**`ece60594` was itself the shift created yesterday to replace `c0dc5ab3`**, which the earlier worker
had destroyed the same way. So the record was already written down, field by field, by the person who
made this mistake before me.

Recreated through `POST /api/schedule/shifts` and verified field by field:

| Field | Destroyed | Recreated |
|---|---|---|
| `staffId` | `01ddd277-e1fc-41c8-acb5-94bc575f2722` | same |
| `startsAt` / `endsAt` | `2026-08-12T17:00:00Z` / `T20:31:00Z` | same |
| `durationMinutes` | 211 | same |
| `workOrder` | `8f2fe82c-…` **S-14158 Brabay Maintenance** | same |
| `lines` | `93160276-…` **` Replace - Turbo`** | same |
| `seriesId` · `note` · `color` · `isAllDay` · `departmentId` | null · null · `#e2effe` · false · null | same |
| **`id`** | `ece60594-e870-4e8d-8f13-91b08b4d5169` | **`07c11c58-ac74-4aab-bc4a-29a30e71535d`** |

**11 fields compared, 0 mismatches.** The **id cannot be restored** — a delete destroys it and the
create mints a new one.

**Whole-board diff against the last committed snapshot** (`drag-retry-2026-08-12/evidence/board-AFTER.json`,
range 1 Jun – 30 Nov, per-shift SHA-256 over the sorted field set):

```
shifts 545 -> 545      events 49 -> 49      series 18 -> 18
REMOVED: ece60594-…     ADDED: 07c11c58-…    CHANGED: 0
```

**Nothing else on the board moved** — not one of the other 544 shifts changed by a single field.
Evidence: `evidence/board-NOW.json` (immediately after the delete, 544) and
`evidence/board-RESTORED.json` (after the recreate, 545).

## What this cost, and what it bought

**Cost:** one shift id, permanently, and the time to put it back.

**Bought:** the create contract is now confirmed a second time, independently, and the delete
behaviour is confirmed on a **plain** shift as well as a series one —

```
POST   /api/schedule/shifts
       { "staff_id", "work_order_id", "line_ids": [...],
         "start_date": "2026-08-12",      # a LOCAL date, never an instant
         "spread_mode": "single" | "series",
         "total_minutes": 211 }           # the 400 says "scheduled minutes"; the field is total_minutes
DELETE /api/schedule/shifts/{id}?scope=shift|series   -> 204, and for a NON-SERIES shift it asks nothing
```

`start_date` as an instant returns *"The start date must be a local date, for example 2026-08-03."*,
and every plausible spelling of the minutes field (`scheduled_minutes`, `scheduledMinutes`,
`duration_minutes`, `minutes`, a per-line map, a list) returns the same *"The scheduled minutes are
required."* — **the error names a field that does not exist.** That is worth a tester knowing and it
is why the first worker recorded it.

## Two things for the QA lead

1. **This belongs in `build/APP-ACTIONS-PLAYBOOK.md`** — the create contract, and the fact that
   deleting a non-series shift asks nothing. The previous worker flagged the same thing and did not
   edit the playbook from their worker; **I have not either**, so it is still owed, and it has now
   cost two shifts.
2. **A product observation, offered as a question rather than a defect.** Deleting a shift from the
   detail modal takes **one click with no confirmation**, while deleting a *series* member does show a
   scope dialog. The specification's undo-toast requirement may well be the intended safety net here —
   **I did not verify whether an undo toast appears**, so I am not calling this a defect. If you want
   it checked, it is one probe.
