"""Phase D (the design worker) fills DREFS: case key -> {"boards": ["Main", ...], "pictures": ["<png name>", ...], "words": ["<verbatim
board or note text>", ...], "note": "<one sentence for References from Design>"}. wwlib.design_of() ADDS these to the case's own design=
references, never replaces them. Every board is a file stem of sources/design-2026-10-27-artifact/files/canvas.json (Main, EditAfter,
QuickBooks, EdgeCases, Truncation, DialogBefore, EditBefore); every word must be verbatim in a board's visible text or a canvas note; every
picture must exist in full-pass-2026-10-27/design/images/ or sources/design-2026-10-27-artifact/png/ (wwlib.check). Phase A leaves it
empty: no board picture existed on 27 Oct (the 27 Oct copy has 0 images; the boards are HTML)."""
DREFS = {}
