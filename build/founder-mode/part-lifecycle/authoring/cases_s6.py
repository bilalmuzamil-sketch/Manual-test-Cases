"""Story 6 — Search and Sort the Inventory List by Tracking State (SV-10819). Section 20473.
PHASE B STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  S6-01   C154774  Searching not tracked returns untracked parts plus normal matches
  S6-02   C154775  Total Qty sort puts untracked parts below tracked parts in both directions
  S6-03   C425641  Searching track or no does not find untracked parts by their tracking
  S6-04   C425642  With no untracked parts, searching not tracked returns no results
  S6-05   C425643  Sorting by Avg Cost ignores whether parts are tracked
  S6-06   C425644  With no sort chosen, tracked parts are listed before untracked parts
  S6-07   C425645  Supply filter shows an untracked part only under All
  S6-08   C425656  Global search shows Not Tracked for an untracked part
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
