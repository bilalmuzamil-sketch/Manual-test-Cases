"""Story 10 — Confirming and Recording a Status Change (SV-10823). Section 20477.
PHASE B STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S10-01  C154789  Saving a different Part Status asks to confirm first
  S10-02  C154790  Bulk change that partly fails lists the failed part and its reason
  S10-03  C154791  A status change records who made it and when
  S10-04  C154792  Deactivating then reactivating keeps two Part History entries
  S10-05  C154793  Part History entry wording with and without a note
  S10-06  C154794  Bulk confirmation title and first line give the count
  S10-07  C154795  Bulk deactivation confirmation shows its three lines in order
  S10-08  C154796  Reactivation confirmation from the part dialog has one line
  S10-09  C154797  Confirmation note field is labelled Note (Optional) and stops at 255
  S10-10  C154798  Part History columns keep their width for a short entry
  S10-11  C154799  Confirm button is red to deactivate and blue to activate
  S10-12  C154800  Cancelling the confirmation changes nothing
  S10-13  C425760  Part dialog confirmation names the part as typed in the form
  S10-14  C425761  Part dialog deactivation confirmation shows its three lines in order
  S10-15  C425762  Bulk reactivation confirmation shows its two lines
  S10-16  C425763  Confirmation lines use medium weight and grey as specified
  S10-17  C425764  Bulk change that succeeds shows how many parts were updated
  S10-18  C425765  Bulk change lists a part deleted meanwhile as Part not found
  S10-19  C425766  A core has no row of its own to tick in Deactivate parts
  S10-20  C425767  A note of only spaces records no note
  S10-21  C425768  Bulk change of forty parts writes forty Part History entries
  S10-22  C425769  A core's status change writes its own Part History entry
  S10-23  C425770  A status entry has Staff, Date and Time and can be searched
  S10-24  C425771  Turning tracking off and on writes two Part History entries
  S10-25  C425772  Changing Min and Max in the part dialog writes one history entry
  S10-26  C425773  Changing Min and Max through the parts import writes an Import entry
  S10-27  C425774  Changing a part number is recorded at both locations with Changed at
  S10-28  C425775  Changing a description is recorded at both locations with Changed at
  S10-29  C425777  A core gets the same number and description history entries
  S10-30  C425778  Part History search finds entries by text or staff, in any case
  S10-31  C425779  Part History search shows only the matching bin rows
  S10-32  C425780  Prices in Part History are searchable only by users who see prices
  S10-33  C425781  Bulk change where every part fails keeps the selection
  S10-34  C425782  A status change with no parts ticked cannot be sent
  S10-35  C540883  Bulk change count does not count the cores that change with their parts
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
