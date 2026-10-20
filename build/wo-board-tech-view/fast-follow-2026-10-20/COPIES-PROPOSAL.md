# Proposed release copies of the mixed Fast-follow cases (20 Oct 2026) — waiting for the QA lead's go-ahead

Each copy is a new case in the original case's folder, with the same preconditions and expected results (PRD v68 quotes),
minus the part that waits on SV-11522 / SV-11524 (the new lead-change message with Undo, the one-click lead technician
dialog, the "Assign lead technician" menu wording). Where the original reaches a lead change through that dialog, the copy
uses a drag or the work order page instead, which the release already has. Copies go into run 498 and carry AUTOMATION: READY.
The original stays in Fast-follow, unchanged.

| Original | The copy keeps | Left only in Fast-follow |
|---|---|---|
| C96963 lead of an Invoiced or Paid work order cannot be changed | every refused drag, reorder within the technician, the work order page | the "assigned to" messages |
| C96969 choosing the current lead again changes nothing | — no copy: the whole case is the dialog | all of it |
| C96973 Reassign can pick a technician outside the filter | the dialog lists technicians outside the filter (steps 1–5) | picking one and the card leaving |
| C154889 removing the lead asks the clear-shifts question | the question on drag to Unassigned and on Unassign | the message |
| C368133 the question appears only for unfinished shifts | every question check | the message |
| C368135 Cancel or closing the question calls the change off | Cancel, close and Escape on a drag, in both views | the dialog path |
| C368136 the question shows on Board and Tech View only | drag, Unassign, Tech View, work order page, List, Schedule | the dialog path |
| C368140 assigning a lead to unassigned work moves only open unassigned lines | the line check, assigning by dragging the card out of Unassigned | the Assign menu wording, one-click dialog, message |
| C581891 a line with only a Schedule shift technician follows the new lead | the line check, changing the lead by drag | the dialog and the message |
| C581892 the question ignores lines not approved or declined | every question and Schedule check | the message |
| C581893 an Entire work order shift stops counting | the question checks | the message |
| C97002 dragging changes the lead, Unassigned clears it | every lead change by drag, both views | the message |
| C97007 a new lead from Reassign or the page goes to the bottom | the work order page path, the drag path, the second user | the dialog path |
| C97008 moving shows the message, reordering shows none | reordering shows no message, the header counts | the move message's wording |
| C97009 Invoiced and Paid can only be reordered within their technician | every lock and reorder check | the "assigned to" messages |
| C368144 removing the lead puts the work order in its normal place | Unassign and the work order page paths, both views | the "moved to Unassigned" message |
| C97028 blocked analytics never stops the page | settings, density, drag, refresh | the message |

16 copies; C96969 has none. Titles: same as the original (the folder tells them apart), unless the QA lead wants a suffix.
