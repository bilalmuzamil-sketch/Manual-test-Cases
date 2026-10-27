"""SV-10380 — Inventory Value net quantity (bin quantities below zero), ships with this epic. Section 54274. Phase C also decides SV-11756 (duplicate-part merge tool and past Inventory Value): the merge tool is a console command a manual tester cannot run, so expect it to be recorded as NO MANUAL CASE in requirement_map.py and the ticket ledger, unless a screen path is found.
PHASE C STUB (written by Phase A, 27 Oct 2026). Rewrite every case below top to bottom (Rule 134) in the QA lead's pattern,
keeping its key (and so its C-id); add new keys for new requirements (next free number) and split parts as <key>b, <key>c with
part_of=<original key> (Rule 136). Then set WRITTEN = True: build.py then enforces coverage of this story's codes and its
User Feedback Summary messages. Read ../PHASE-A-HANDOFF.md first.

Live cases to rewrite (key, C-id, title on 14 Oct 2026):
  IV-01   C425660  Bins of +5 and -2 show quantity 3 and $30 in Inventory Value
  IV-02   C425661  A part with only a -2 bin shows -2 and -$20 and lowers the totals
  IV-03   C425662  Bins of +5 and -5 add nothing to the Inventory Value totals
  IV-04   C425663  Bins of +5 and +3 still show quantity 8 and $80 in Inventory Value
  IV-05   C425664  The Inventory list's available quantity still ignores a negative bin
  IV-06   C425665  The Supply filter still uses the positive bins for a part with a negative bin
  IV-07   C425666  Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50
  IV-08   C425667  The Inventory Value export shows the same net figures as the screen
  IV-09   C425668  Inventory Value location and category filters still scope the net figures
  IV-10   C540878  Inventory Value for a day after release counts a bin below zero
  IV-11   C540879  Inventory Value for a date before release keeps its saved figures
"""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = False
SECTION = "IV"
