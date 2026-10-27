"""Story 11 — The Part Library Is Browse and Edit Only (SV-10824). Section 20478.
PHASE C STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S11-01  C154828  The Part Library page has no button that creates an entry
  S11-02  C154829  Clicking a Part Library row opens the entry's detail page
  S11-03  C154830  A new Part Library entry appears only when a new part number is used
  S11-04  C154831  Part Library entries from before the release stay listed
  S11-05  C425607  Users with and without Create & Edit see the same Part Library toolbar
  S11-06  C425608  Part Library rows can still be ticked and changed with Set category
  S11-07  C425609  Part Library search, filters, sorting and columns still work
  S11-08  C425610  Changing an entry's number on the Part Library page renames the part
  S11-09  C425611  Changing an entry's description on the Part Library page reaches every location
  S11-10  C425612  The Part Library page refuses a number that another entry already has
  S11-11  C425613  A number changed on the Part Library page reaches an open part request
  S11-12  C425614  A Part Library number over 50 characters is refused while on an open request
  S11-13  C425615  The Part Library page keeps upper and lower case in a typed part number
  S11-14  C425616  A part requested from a vendor reaches the Part Library when it is received
  S11-15  C425617  Spaces around a typed part number do not create a second Part Library entry
  S11-16  C425618  An entry with no part behind it can be edited and a new part links to it
  S11-17  C540877  Receiving a typed purchase order line adds its number to the Part Library
  S11-18  C573671  Delete is disabled while a part still uses the Part Library entry
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
