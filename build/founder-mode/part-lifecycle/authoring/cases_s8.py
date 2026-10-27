"""Story 8 — Permissions (SV-10821). Section 20475.
PHASE B STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S8-01   C154780  Without Delete, the actions menu offers no Deactivate parts or Activate parts
  S8-02   C154781  Without Delete, the tracking switch shows but cannot be changed
  S8-03   C154782  Admin, Service Manager and Parts Manager see the status and tracking controls
  S8-04   C154783  A status change is refused for a user who has just lost the right to delete
  S8-05   C425646  A user with only View sees no Inventory actions menu
  S8-06   C425647  A custom role can change part status only once Delete is granted
  S8-07   C425648  Without Delete, New Inventory Part creates only tracked parts
  S8-08   C425649  Without Delete, Part Status in the part dialog is disabled
  S8-09   C425650  Without Delete, the part dialog shows no Delete Part button
  S8-10   C425651  Without Delete, a user can still rename a part stocked at two locations
  S8-11   C425652  Without Delete, pricing and bin quantities can still be edited as before
  S8-12   C425653  Without Delete, a user can still edit an untracked part's price and bins
  S8-13   C425654  A tracking change is refused for a user who has just lost the right to delete
  S8-14   C425655  Creating an untracked part is refused for a user who has just lost Delete
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
