"""Section DESIGN, "Design — how it looks" (new section under What/Why 20437; the coordinator creates it and writes its id into
../section-map.json as "DESIGN"). Keys D-01, D-02 ...; every title starts "Design: " (Rule 117 twelfth amendment).

STUB left by Phase A (27 Oct 2026) for Phase D part 2. Phase D writes its cases here ONLY, after its design drive (part 1, files only under
full-pass-2026-10-27/design/), on the coordinator's word; then sets WRITTEN = True. Rules: PHASE-A-HANDOFF.md §3 and §6.
A design-version case for a design-vs-PRD difference (Rule 130) takes marker=DESIGN_HOLD (or PO_HOLD("Qn", why)) and its question id
goes into wwlib.DESIGN_QUESTIONS.

Example shape (do not uncomment as is):
from wwlib import C, DESIGN_HOLD, PO_HOLD, HOLD
from common import *
C("D-01", "DESIGN", "Design: New Line shows Title and Description labels above their boxes",
  [ADMIN, "Have an open work order, work order 1, that is not invoiced, so you can add a line to it.", START_LINES,
   "Use a desktop browser window 1440 pixels wide."],
  [NEW_LINE],
  [["The New Line window opens over work order 1 and matches the attached picture of the board \\"New Line - after\\": ..."]],
  ["S1-R3"], design=dict(boards=["Main"], pictures=["<from full-pass-2026-10-27/design/images/>"]))
"""
from wwlib import C, DESIGN_HOLD, PO_HOLD, HOLD   # noqa: F401
from common import *   # noqa: F401,F403

WRITTEN = False
SECTION = "DESIGN"
