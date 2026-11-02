"""References from Design (Rule 117 tenth amendment) for the PRD cases whose screen a design board draws, round 2 (2 Nov 2026).
Built from design-2026-11-02/DESIGN-FIGURES-2026-11-02.json (each figure's page, badge, heading, picture and captions, quoted as the
design's own words) and SPEC-TO-DESIGN-2026-11-02.json (which requirement each picture shows). A case with no entry here gets no
References from Design heading at all (coordinator, round 2). cases_design.py adds the design cases' own entries to the same DREFS.
Differences are named with their register id (DESIGN-DIVERGENCE-REGISTER.json); the expected results still follow the PRD."""
import json, os
_P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_F = {f["image"].split("/")[-1]: f for f in json.load(open(f"{_P}/design-2026-11-02/DESIGN-FIGURES-2026-11-02.json"))["figures"]}
CANVAS = ('Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026')
P6_NOTE = ("Time sheets keep every Time Clock user: a Parts Manager can still clock in and record time. Part sales have no technician "
           "dropdown on screen, so nothing there looks different.")
DREFS = {}

def ref(keys, pics, notes=(), words=(), captions=True, page_only=None):
    pics = [f"tt-{p}.png" if not p.endswith(".png") else p for p in pics]
    full = [next(k for k in _F if k.startswith(p[:-4] if p.endswith(".png") else p)) for p in pics]
    parts, seen = [], {}
    for k in full:
        f = _F[k]; seen.setdefault(f["page_name"], []).append(f'"{f["heading"]}" ({f["badge"]})')
    pages = CANVAS + ": " + "; ".join(f'page "{pg}", picture{"s" if len(v) > 1 else ""} {" and ".join(v)}' for pg, v in seen.items()) if full else \
        CANVAS + ": " + page_only
    w = [c for k in full for c in _F[k]["captions"]] if captions else []
    for k in keys:
        DREFS[k] = {"pages": pages, "pictures": full, "words": list(dict.fromkeys(list(w) + list(words))), "notes": list(notes)}

# ---- Story 1: the staff window (pages 2 and 3) ---------------------------------------------------------------------------------
ref(["S1-01"], ["p2-02", "p2-01"])
ref(["S1-02"], ["p2-05", "p2-04"])
ref(["S1-03"], ["p2-02", "p5-04"], notes=["The Work Orders display switcher's \"New\" pill is drawn on the Tech View picture."])
ref(["S1-04", "S1-05"], ["p2-02"], notes=["The design does not draw the window after the end date (register TT-N17)."])
ref(["S1-06", "S1-07", "S1-08", "S1-09", "S1-10", "S1-11", "S1-15", "S1-17", "S1-18", "S1-21"], ["p2-03"])
ref(["S1-22"], ["p2-03", "p2-07"])
ref(["S1-12", "S1-13", "S1-20", "S1-26", "S1-27", "S1-28", "S1-29"], ["p3-02"],
    notes=["The design draws the Office User role only; Time Clock User and the custom roles are not drawn (register TT-N03)."])
ref(["S1-14", "S1-19"], ["p3-01"])
ref(["S1-16"], ["p3-01", "p2-03"],
    notes=["Difference: the page 3 note says turning Time Clock back on leaves Technician off and that Edit behaves the same; the page 2 "
           "note and S1-R5 say New Staff Member sets it again from the role (register TT-D01, PO question 5). This case follows the PRD and is held."])
ref(["S1-23", "S1-24"], ["p2-05", "p2-03"])
ref(["S1-25"], ["p3-01"], notes=["Page 3 note: \"Shown in the New Staff Member window; Edit behaves the same.\""])
ref(["S1-30", "S1-31"], ["p2-06", "p2-07"], notes=["The staff window's existing save button is labelled Save & Close (register TT-D05, settled by S1-R6)."])
ref(["S1-32", "S1-33", "INV-09"], ["p2-07"])
ref(["S1-37"], ["p2-02", "p2-03"],
    notes=["The design shows both Save & Add Next and Save & Close in every New Staff Member picture; the PRD names only \"the window's "
           "existing Save\" (register TT-D06, PO question 8). Held."])
ref(["INV-11"], ["p2-06"])
# ---- Story 2: the warning (page 4) ----------------------------------------------------------------------------------------------
_S2W = ["S2-%02d" % i for i in list(range(1, 15)) + [22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]]
ref(_S2W, ["p4-02", "p4-01"], notes=["The design draws the plural form only (\"Emily Madden leads 15 open work orders and is on 141 labor lines\"); the "
                                     "single-count forms are not drawn (register TT-N04). The text comes from S2-R3."])
ref(["S2-%02d" % i for i in range(15, 22)], ["p4-02"], notes=["No picture of a save without the warning; the design's words are the warning caption."])
ref(["S2-23"], ["p4-01", "p4-02"])
# ---- Story 3: the lists (pages 5 and 6) ---------------------------------------------------------------------------------------
ref(["S3-01", "S3-19", "S3-20"], ["p5-02", "p5-01"])
ref(["S3-02"], ["p5-04", "p5-03"])
ref(["S3-03", "S3-48"], ["p5-06", "p5-05"])
ref(["S3-04", "S3-05", "S3-44"], ["p5-08", "p5-07"], notes=["The design draws the Reassign lead technician window only; Assign lead technician is not drawn."])
ref(["S3-06"], ["p5-08"], notes=["The \"Current · no longer assignable\" entry is described in the PRD and not drawn (register TT-N08)."])
ref(["S3-07", "S3-45"], ["p6-02", "p6-01"])
ref(["S3-08", "S3-09"], ["p6-04", "p6-03"], notes=["The design draws Add Technician in Edit Line; the New Line window is not drawn (register TT-N11)."])
ref(["S3-10", "S3-23"], ["p6-04"], notes=["The caption says \"Add Labor uses the same list.\"; the PRD names the Edit Labor window (register TT-D03, settled by "
                                          "S3-R6). The Edit Labor window is not drawn (register TT-N10)."])
ref(["S3-11", "S3-12", "S3-13", "S3-14", "S3-15"], ["p5-02", "p6-02"],
    notes=["The pictures show the Technician-off condition only; the other S3-R1 conditions are not drawn (register TT-D11, settled by S3-R1)."])
ref(["S3-17", "S3-18", "S3-22"], ["p5-02", "p6-02"], notes=["A former technician lead is described, not drawn: the after pictures have no lead (register TT-N07)."])
ref(["S3-21"], ["p6-04"], notes=["The card at the left shows the label \"Lead Technician\"; S3-R7a writes \"Lead technician\" and says \"as it does today\" "
                                 "(register TT-D07, settled)."])
ref(["S3-24", "S3-25", "S3-26"], ["p6-04"],
    notes=["Difference: the caption on this picture says a former technician on a line \"shows grayed out\"; S3-R8 says an ordinary chip with its "
           "X in Edit Line (register TT-D02, PO question 6). This case follows the PRD and is held."])
ref(["S3-29", "S3-30"], [], page_only='page "5 Board View and Tech View" (the empty state is not drawn, register TT-N12); design system library '
    "ds/shopview/components.css, section EMPTY STATE",
    words=["One rule for every empty state in the product: ONE icon from the set, a title, at most one sentence, and the action that fills it."],
    notes=["Difference: the design system the canvas uses allows at most one sentence; S3-R10 gives two (register TT-D04, PO question 7). "
           "This case follows the PRD and is held."])
# ---- Story 4: the staff list (page 1) -------------------------------------------------------------------------------------------
ref(["S4-01", "S4-03", "S4-04", "S4-05", "S4-11"], ["p1-02"])
ref(["S4-02"], ["p1-02"], notes=["The design draws the Active tab only (register TT-N15)."])
ref(["S4-06"], ["p1-02", "p1-01"])
ref(["S4-07"], ["p1-02"], notes=["The list's load error is not drawn (register TT-N16)."])
ref(["S4-08", "S4-09", "S4-10"], ["p1-02"], notes=["The after-the-end-date state is not drawn (register TT-N17)."])
# ---- What must not change (page 6 board note) ------------------------------------------------------------------------------------
ref(["INV-01", "INV-02", "INV-07", "INV-10"], [], page_only='page "6 Technician dropdowns on a work order" (board note; no picture)', words=[P6_NOTE])
