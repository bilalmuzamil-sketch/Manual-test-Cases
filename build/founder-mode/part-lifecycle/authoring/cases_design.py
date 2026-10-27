"""Design — how it looks (Rule 126). NEW section under Part Lifecycle 20439 (the coordinator creates it; section_id None in
proposals.json until then). Keys D-01, D-02 ...; every title starts "Design: " (Rule 117 twelfth amendment); sec="DESIGN".
PHASE D STUB (written by Phase A, 27 Oct 2026). Phase D writes the design-look cases here and the per-case design references in
design_refs.py (DREFS), then sets WRITTEN = True. A design-vs-PRD difference gets a held case with marker DESIGN_HOLD and a row in
../DESIGN-DIVERGENCE-REGISTER.json plus a question in ../full-pass-2026-10-27/QUESTIONS.json (Rule 130). Pictures: put readable PNG
names under ../full-pass-2026-10-27/design/images/ or use the board PNGs in ../sources/design-2026-10-13-artifact/png/. Read
../PHASE-A-HANDOFF.md first."""
from pllib import C, DESIGN_HOLD, HOLD, PO_HOLD
from common import *

WRITTEN = False
SECTION = "DESIGN"
