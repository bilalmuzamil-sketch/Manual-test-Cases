"""Story 7 — Create a Part by Typing Its Number and Description (SV-10820). Section 20474.
PHASE B STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S7-01   C154776  New Inventory Part opens with Description then Part Number, no library pick
  S7-02   C154777  A number that exactly matches one Part Library entry links to it
  S7-03   C154778  A number held by two Part Library entries gets a new entry of its own
  S7-04   C154779  Description and Part Number must be filled to save a new part
  S7-05   C425669  Spaces before and after the number and description are removed on save
  S7-06   C425670  A linked Part Library entry keeps its tags and gains the new ones
  S7-07   C425671  A linked entry with no manufacturer takes the one picked on the new part
  S7-08   C425672  A linked entry keeps the manufacturer it already has
  S7-09   C425673  A linked entry keeps its own category
  S7-10   C425674  No Part Library message when the typed description only differs in case
  S7-11   C425675  A new number creates its own Part Library entry with no message
  S7-12   C425676  A number that differs only in upper or lower case is not linked
  S7-13   C425677  A part number already stocked here and active is refused
  S7-14   C425678  A part number already stocked here but inactive is refused
  S7-15   C425679  With active and inactive matches, the active part's number is named
  S7-16   C425680  Saving a part with its number unchanged is never refused as a duplicate
  S7-17   C425681  Changing a part's number to one already stocked here is refused
  S7-18   C425682  A blank description or number never reaches the save
  S7-19   C425683  A part that existed before the release keeps its Part Library entry
  S7-20   C540880  Changing only the case or punctuation of a part's own number saves
  S7-21   C573678  A parts import row with a number already stocked here updates that part
  S7-22   C573679  A parts import row with no part number is skipped with no message
  S7-23   C573680  An import row with no description keeps the part's description
  S7-24   C573681  A new part imported with no description takes its part number
  S7-25   C573682  An imported part with no bin location goes to the Unassigned bin
  S7-26   C573683  A linked entry whose manufacturer no longer exists takes the one picked
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
