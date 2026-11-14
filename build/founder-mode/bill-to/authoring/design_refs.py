"""References from Design (Rule 117 tenth amendment), round 2 (9 Nov 2026).
- Design cases D-01..D-70: design_refs_design.json, made by make_cases_design.py from the design worker's drafts.
- PRD cases: built here from design-2026-11-09/SPEC-TO-DESIGN-2026-11-09.json (each PRD line's verdict and the figures that show it)
  and DESIGN-FIGURES-2026-11-09.json (page, figure heading, badge, picture, caption). A PRD case gets a block only when a code it quotes is
  SHOWN or DIFFERENT on a board; a case whose screen no board draws gets no heading at all. A DIFFERENT code adds the difference with its
  register id and the PO question number (Rule 130 item 3), so a later ruling finds every affected case by search.
Design: "Bill To design" https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, version 1794239066-4906, read 9 Nov 2026."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
DD = f"{P}/design-2026-11-09"
CANVAS = 'Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794239066-4906, read 9 Nov 2026'
DREFS = json.load(open(f"{D}/design_refs_design.json"))
FIG = json.load(open(f"{DD}/DESIGN-FIGURES-2026-11-09.json"))["list"]
S2D = {r["code"]: r for r in json.load(open(f"{DD}/SPEC-TO-DESIGN-2026-11-09.json"))["rows"]}
REG = {d["id"]: d for d in json.load(open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json"))["differences"]}
QMAP = {1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15}   # design question -> merged sheet number
BYPIC = {}
for f in FIG:
    if f.get("figure_picture"): BYPIC[os.path.basename(f["figure_picture"])[:8]] = f   # "bt-p1-12" -> figure

# ---- 14 Nov 2026: page 4 redrawn (canvas version 1794608112-d8a1; the other 7 boards byte-identical). The old page 4 figures are
# replaced by the new ones (design-2026-11-14/DESIGN-FIGURES-P4-2026-11-14.json); an old picture number found in SPEC-TO-DESIGN rows is
# mapped to the new figure that shows the same document (the old "part sale with a vehicle" row is gone: both part sale rows map to the
# new part sale row). Story 8's spec-to-design rows are re-read from the new board (S8 below), replacing the 9 Nov 2026 rows.
CANVAS_1114 = 'Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026'
FIG4 = json.load(open(f"{P}/design-2026-11-14/DESIGN-FIGURES-P4-2026-11-14.json"))["list"]
NEW4 = {f["n"]: f for f in FIG4}
OLD2NEW = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 9, 14: 10, 15: 11, 16: 12,
           17: 13, 18: 14, 19: 15, 20: 16, 21: 17, 22: 18}
for _k in [k for k in BYPIC if k.startswith("bt-p4-")]: del BYPIC[_k]
for _o, _n in OLD2NEW.items(): BYPIC[f"bt-p4-{_o:02d}"] = NEW4[_n]
FIG = [f for f in FIG if f["page"] != 4] + FIG4
S8 = {   # code -> (verdict, pictures by their OLD number key, mapped by OLD2NEW: old 18/20/22 = new 14/16/18), read from ServiceFor.dc.html version 1794608112-d8a1 on 14 Nov 2026
 "S8-R1": ("SHOWN", "bt-p4-02 bt-p4-04"), "S8-R2": ("SHOWN", "bt-p4-04 bt-p4-02"), "S8-R3": ("NOT SHOWN", ""),
 "S8-R4": ("SHOWN", "bt-p4-02 bt-p4-10"), "S8-R5": ("SHOWN", "bt-p4-02"), "S8-R6": ("SHOWN", "bt-p4-02 bt-p4-04 bt-p4-06 bt-p4-22"),
 "S8-R7": ("SHOWN", "bt-p4-02"), "S8-R8": ("SHOWN", "bt-p4-02 bt-p4-06"), "S8-N1": ("SHOWN", "bt-p4-18 bt-p4-20"), "S8-N2": ("NOT SHOWN", "")}
for _c, (_v, _w) in S8.items(): S2D[_c] = {"code": _c, "verdict": _v, "where": _w, "note": ""}


def for_codes(codes, max_pics=4):
    figs, notes = [], []
    def add(pre):
        f = BYPIC.get(pre)
        if f and f not in figs: figs.append(f)
    for code in sorted(codes):
        r = S2D.get(code)
        if not r or r["verdict"] not in ("SHOWN", "DIFFERENT"): continue
        for pre in re.findall(r"bt-p\d-\d\d", r.get("where") or ""): add(pre)
        if r["verdict"] == "DIFFERENT":
            for rid in re.findall(r"BT-D\d\d", r.get("note") or ""):
                d = REG.get(rid)
                if not d: continue
                qn = int(re.search(r"question (\d+)", d["question"]).group(1))
                if qn not in QMAP: continue          # design question 13 was dropped (no verdict depends on it)
                for pre in re.findall(r"bt-p\d-\d\d", d.get("picture") or ""): add(pre)
                n = (f"Difference {rid} on {code} ({r['note']}): this case follows the PRD; the design's version is asked in question "
                     f"{QMAP[qn]}.")
                if n not in notes: notes.append(n)
    if not figs: return None
    figs = figs[:max_pics]
    head = ((CANVAS_1114 if any(f["page"] == 4 for f in figs) else CANVAS) + ": pictures " + ", ".join(f'"{f["heading"]}" (page {f["page"]} "{f["page_name"]}", {f["badge"]})' for f in figs)
            + ". Compare the screen with the pictures; the expected results come from the PRD.")
    words = []
    for f in figs:
        for cap in f.get("captions") or []:
            if cap not in words and len(words) < 3: words.append(cap); break
    return {"pages": head, "pictures": [os.path.basename(f["figure_picture"]) for f in figs], "words": words, "notes": notes}


def for_case(c):
    if c["key"] in DREFS: return DREFS[c["key"]]
    return for_codes({x for x in c["q"] if isinstance(x, str)})
