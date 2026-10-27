"""Story 9 — Inactive Parts Cannot Be Added to New Work (SV-10822). Section 20476.
PHASE B STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S9-01   C154784  Work order part lookup no longer offers a part once it is inactive
  S9-02   C154785  Inactive part's dialog shows a grey Inactive badge in the title row
  S9-03   C154786  A user with only the View permission can open the Inactive tab
  S9-04   C154787  A work order line keeps its inactive part and can still be edited
  S9-05   C154788  An invoiced work order with an inactive part can be viewed and printed
  S9-06   C425724  Estimate part lookup no longer offers a part once it is inactive
  S9-07   C425725  Technician charge-out does not offer or accept an inactive part
  S9-08   C425726  Technician charge-out on a phone refuses an inactive part number
  S9-09   C425727  Purchase order line lookup does not offer an inactive part
  S9-10   C425728  Re-pointing a received vendor bill line does not offer an inactive part
  S9-11   C425729  Part sale line lookup does not offer an inactive part
  S9-12   C425730  Canned job is added without its inactive parts and one warning names them
  S9-13   C425731  Canned job warning names a typed vendor part by the inactive part's number
  S9-14   C425732  Canned job leaves out the fee that belongs to an inactive part
  S9-15   C425733  Vendor return lookup offers an inactive part with a grey Inactive tag
  S9-16   C425734  Vendor credit lookup offers an inactive part with a grey Inactive tag
  S9-17   C425735  Credit on a part sale invoice lists an inactive part with its tag
  S9-18   C425736  Credit on a work order invoice lists an inactive part with its tag
  S9-19   C425737  Library entry stocked only elsewhere is hidden when it matches an inactive part
  S9-20   C425738  Typing an inactive part number in full shows the inactive message
  S9-21   C425739  Saving a part request is refused once the part was retired meanwhile
  S9-22   C425740  Saving a part sale line is refused once the part was retired meanwhile
  S9-23   C425741  Saving a purchase order line is refused once the part was retired meanwhile
  S9-24   C425742  Global search lists an inactive part with a grey Inactive tag
  S9-25   C425743  Selecting an inactive part in global search opens the Inactive tab
  S9-26   C425744  Global search shows Not Tracked for an untracked part
  S9-27   C425745  A user without the View permission sees neither Inventory tab
  S9-28   C425746  Vendor return part search without View shows the access error
  S9-29   C425747  A completed part sale line with an inactive part keeps its totals
  S9-30   C425748  Changing a line to another inactive part is refused
  S9-31   C425749  A work order holding an inactive part can still be invoiced
  S9-32   C425750  Reopening a completed work order leaves its inactive part inactive
  S9-33   C425751  A part retired while on order can still be received and picked
  S9-34   C425752  Splitting a work order moves a line that holds an inactive part
  S9-35   C425753  Parts import updates an inactive part in place and keeps it inactive
  S9-36   C425754  Parts import with a blank Manufacturer keeps the part's manufacturer
  S9-37   C425756  Inventory Value report still lists a part after it is set inactive
  S9-38   C425757  Parts Velocity report still lists an inactive part's sales
  S9-39   C540882  No invoice-line or scan part lookup offers an inactive part
  S9-40   C573684  Canned job warning lists inactive parts A to Z, separated by commas
  S9-41   C573685  Without Vendor Order Management View, Returns cannot be opened
  S9-42   C573686  With Vendor Order Management View only, a new return cannot be started
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
