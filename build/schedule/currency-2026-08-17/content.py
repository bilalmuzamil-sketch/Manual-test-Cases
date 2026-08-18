# -*- coding: utf-8 -*-
"""Content-stale (a) overrides: v30 body/title/steps/refs for the 5 cases whose
EXPECTATION diverged from spec v30 (not just the version pin)."""

CONTENT = {
 "SCH-DEL-01": {  # C30057 - delete-scope wording: "hours returned" -> "how many scheduled hours it removes" (v30 remaining-hours model)
   "title": "Deleting a middle shift of a series offers all three scope options",
   "refs": "SV-8692 (§7 (Series-aware deletion))",
   "steps": "1. Delete a MIDDLE shift of the series (via the detail modal's Delete).\n2. Read the scope options offered (do not confirm yet).",
   "body": ("1. A scope prompt appears with three options: this shift only, this and everything after, and the whole series.\n"
            "2. Each option states how many scheduled hours it removes.\n"
            "3. The prompt uses routine, lightweight styling - not alarming destructive styling."),
 },
 "SCH-DEL-02": {  # C30058 - "hours return to the estimate's remaining" is the old model; v30: scheduled/estimate/clocked are separate
   "title": "'This shift only' removes that day and the series keeps the gap",
   "refs": "SV-8692 (§7 (This shift only))",
   "steps": "1. Delete a middle shift with the 'This shift only' scope.\n2. Look at the series on the grid.\n3. Check the scheduled hours.",
   "body": ("1. Only that day's shift is removed.\n"
            "2. The series keeps the gap - the remaining shifts do NOT shuffle to close it.\n"
            "3. The scheduled hours drop by that day's hours (the estimate and any clocked hours are separate quantities and are not changed by the deletion).\n"
            "4. An undo toast appears."),
 },
 "SCH-MODAL-06": {  # C30013 - notes are PER SHIFT (v28), not per work order; the old expect-fail treated the correct build behaviour as a bug
   "title": "Notes can be added, edited, and deleted per shift from the modal",
   "refs": "SV-8695 (§4.9 (Notes: add/edit/delete per shift))",
   "steps": "1. Add a note (text 'ZZAUTOTEST note').\n2. Edit the note's text.\n3. Delete the note.",
   "body": ("1. The note is added and shown in the modal.\n"
            "2. The edit is saved and displayed.\n"
            "3. The delete removes the note.\n"
            "4. Notes are kept per shift - a note added to one shift is shown on that shift only, not on other shifts of the same work order."),
 },
 "SCH-START-05": {  # C29973 - old separate "Unassigned row" + same anatomy -> v30 department-header lane + fixed-width chip
   "title": "Dropping onto a department's unassigned lane creates a shift with no technician",
   "refs": "SV-9234 (§3.2 §4.2 unassigned lane on the department header row)",
   "steps": "1. Drag the line from the sidebar and drop it onto a department's unassigned lane (the department group header row) on a working day.\n2. Look at the created block and the line's roster.",
   "body": ("1. An unassigned shift is created in that department's unassigned lane. The department group header row doubles as the lane - there is no separate 'Unassigned' row.\n"
            "2. It has no technician, and no technician is added to the line's roster by this drop.\n"
            "3. The block renders as a fixed-width chip carrying its hours - it is not scaled to a duration, because no technician's hours have been applied to it yet."),
 },
 "SCH-START-06": {  # C29974 - unassigned start time; v30 dept-header lane + business hours or app-level default; target date recorded
   "title": "Unassigned shift start time uses business hours or the app-level default",
   "refs": "SV-9234 (§4.2 unassigned shift start time)",
   "steps": "1. Drop the line onto a department's unassigned lane (the department group header row).\n2. Read the created shift's start time.",
   "body": ("1. The unassigned shift takes its start time from the same rules as any shift, minus the technician level: the shop's business hours, or - if the shop has no business hours set - the app-level default of 7:00 AM.\n"
            "2. The day you dropped it on is recorded as the shift's target start date."),
 },
}
