# Incident — I deleted a pre-existing shift, and it is recorded here rather than tidied away

**What happened.** While cleaning up the linked series created for C29985, the cleanup probe selected
its target by matching the customer name **`Brabay Maintenance`** on the grid. That customer had a
**pre-existing** shift as well as the eight I had just created, and the click landed on the
pre-existing one:

```
DELETE /api/schedule/shifts/c0dc5ab3-95d9-4a1a-b765-abc7566dcfa9?scope=shift   ->  HTTP 204
```

**There was no confirmation step.** The delete went straight through from the detail modal's
`button_shift_detail_delete`. My probe was written expecting a "this shift or the whole series?"
dialog and would have read it before choosing; for a **non-series** shift no dialog appears at all,
so the destructive action completed on the first click.

**Why the id was the wrong one to trust.** The eight shifts I created and the one I destroyed all
belong to the **same work order, S-14158**, so "the Brabay block" was ambiguous. The correct selector
was the shift **id**, which I already had. Matching on a display string is how a cleanup step becomes
a destructive one.

## What was restored, and what could not be

The full record survived in a board fetch taken earlier in the session, so the shift was recreated
through `POST /api/schedule/shifts` and **verified field by field against the destroyed record**:

| Field | Destroyed | Restored |
|---|---|---|
| `staffId` | `01ddd277-…` | same |
| `startsAt` / `endsAt` | `2026-08-12T17:00:00Z` / `T20:31:00Z` | same |
| `durationMinutes` | 211 | same |
| `workOrder` | `8f2fe82c-…` S-14158 Brabay Maintenance | same |
| `lines` | `93160276-…` Replace - Turbo | same |
| `seriesId` · `note` · `color` · `isAllDay` · `departmentId` | null · null · `#e2effe` · false · null | same |
| **`id`** | `c0dc5ab3-95d9-4a1a-b765-abc7566dcfa9` | **`ece60594-e870-4e8d-8f13-91b08b4d5169`** |

**Every field matches except the id, and the id cannot be restored** — the delete was destructive and
the create mints a new one. **So the board diff will read one REMOVED and one ADDED for good, and that
is the honest record.** Counts are back to baseline exactly: **545 shifts / 49 events / 18 series**.

`bb43d6a3-…` had shown as CHANGED while the series existed; its `isConflict` / `conflictReasons`
`double_booked` flag was a **derived** consequence of the new series double-booking that technician,
and it reverted by itself once the series was removed. Nothing was done to it.

## Two things learned that are worth keeping

1. **Deleting a shift from the detail modal asks nothing.** One click on `button_shift_detail_delete`
   and the shift is gone. Worth knowing before writing any cleanup step, and worth a tester knowing too.
2. **The create contract, learned by probing the validation errors** (the field is `total_minutes`,
   which no amount of guessing from `scheduled_minutes` would have found):

```
POST /api/schedule/shifts
{ "line_ids": [...], "work_order_id": "...", "staff_id": "...",
  "start_date": "2026-08-12",        # a LOCAL date, not an instant
  "spread_mode": "single" | "series",
  "total_minutes": 211 }             # the error says "scheduled minutes", the field is total_minutes

DELETE /api/schedule/shifts/{id}?scope=shift | series      -> 204
```

Belongs in `build/APP-ACTIONS-PLAYBOOK.md`; **not edited from this worker** — flagged for the QA lead.
