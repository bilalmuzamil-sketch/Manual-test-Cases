"""Story 13 — The Part Dialog (SV-10826). Section 20480.
PHASE C STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S13-01  C154836  The part window title shows Active or Inactive beside the close X
  S13-02  C154837  Editing shows Description and Part Number as ordinary text fields
  S13-03  C154838  Saving a new part number renames the part in place
  S13-04  C154839  Changing the part number warns how many other locations it changes
  S13-05  C154840  A number that another Part Library entry has exactly is refused
  S13-06  C425684  Edit Inventory Part lists its fields in the set order
  S13-07  C425685  New Inventory Part lists its fields in the set order
  S13-08  C425686  Cost and price fields show only to a user who can see financial data
  S13-09  C425687  The part window footer shows Delete Part, Cancel and Save
  S13-10  C425688  Cancel closes the part window without saving
  S13-11  C425689  Delete Part shows only on an existing part, to a user with Delete
  S13-12  C425690  Changing the description warns how many other locations it changes
  S13-13  C425691  Saving a new description changes it at every location and on its core
  S13-14  C425692  A number that differs from another entry only in case is accepted
  S13-15  C425693  Description and Part Number cannot be left empty when editing
  S13-16  C425694  Saving with the part number unchanged leaves the number and open work alone
  S13-17  C425695  Adding spaces around the part number is not a change
  S13-18  C425696  A rename carries over to open purchase order lines at every location
  S13-19  C425697  A rename carries over to open part requests
  S13-20  C425698  A rename carries over to canned jobs that hold the part
  S13-21  C425699  A rename carries over to vendor returns that are not completed
  S13-22  C425700  A delivery opened before a rename is received under the new number
  S13-23  C425702  Part Status offers Active and Inactive, set to the saved status
  S13-24  C425703  Part Status is disabled for a user without Delete
  S13-25  C425704  Picking a different status changes nothing until Save
  S13-26  C425705  The status pill keeps the saved status while another is picked
  S13-27  C425706  Save with a different status asks for confirmation first
  S13-28  C425707  Confirming Deactivate saves the edits and shows Part deactivated.
  S13-29  C425708  Confirming Activate saves the edits and shows Part activated.
  S13-30  C425709  Cancelling the confirmation saves nothing and keeps the picked status
  S13-31  C425710  Saving with the saved status picked asks no confirmation
  S13-32  C425711  A status change refused after the save keeps the confirmation open
  S13-33  C425712  A refused save closes the confirmation and saves nothing
  S13-34  C425713  Delete Part deletes the part at once with no confirmation
  S13-35  C425714  Delete Part on a part on a work order shows why and does nothing
  S13-36  C425715  Delete Part on a part with an open return shows why and does nothing
  S13-37  C425716  Deleting a part that reached a work order meanwhile is refused
  S13-38  C425717  Deleting a part that got an open return meanwhile is refused
  S13-39  C425718  A number over 50 characters is refused while on an open part request
  S13-40  C425719  The part window offers no way to move a part to another library entry
  S13-41  C425720  The parts import never changes an entry's part number
  S13-42  C425721  Re-importing the old number of a case-only rename updates that part
  S13-43  C425722  Re-importing a fully different old number creates a separate part
  S13-44  C540881  Vendor always shows in the part window, for every user
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
