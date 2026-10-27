"""Story 12 — Call the Shared Parts List the Part Library (SV-10825). Section 20479.
PHASE C STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S12-01  C154832  The Parts menu, page title and browser tab read Part Library
  S12-02  C154833  Deleting an unused Part Library entry asks and confirms in Part Library words
  S12-03  C154834  Roles & Permissions shows the Part Library and Inventory permission group
  S12-04  C154835  An old bookmark to the Catalog page opens the Part Library
  S12-05  C425619  The edit window for a Part Library entry is titled Edit Library Part
  S12-06  C425620  Deleting a Part Library entry that a part uses is refused
  S12-07  C425621  Saving a Part Library entry that was deleted in another tab is refused
  S12-08  C425623  A part lookup result from the shared list shows Part Library as its source
  S12-09  C425624  A special-order lookup result shows Part Library and its vendor
  S12-10  C425625  Release day leaves every role's permissions as they were
  S12-11  C425626  Release day keeps saved names that contain the word Catalog
  S12-12  C573672  A special order not yet received is not offered with its vendor
  S12-13  C573673  A special order received at another location is not offered with its vendor
  S12-14  C573674  The special-order result names the vendor of the most recent delivery
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
